"use client";

import { useTranslations } from "next-intl";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "sound:v1";
const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, summary, [role='tab']";

const SoundContext = createContext<{
  enabled: boolean;
  toggle: () => void;
} | null>(null);

/**
 * Every voice is synthesised on the fly, so the palette ships zero bytes of
 * audio. The bus is `voice → master gain → compressor → speakers`: the
 * compressor lets presses sit well above hovers without clipping when the two
 * overlap, and the master gain is the one knob for overall loudness.
 *
 * The bus is built on mount so the graph and noise buffer exist before the
 * first interaction. Autoplay policy still parks a context created outside a
 * gesture in `suspended`, so the first activating event resumes it from a
 * capture-phase listener. That listener covers `touchend`/`click` on purpose:
 * `pointerdown` is not a user gesture for touch (nor in WebKit), which is why
 * taps used to stay silent until the sound toggle's `click` resumed the bus.
 */
const MASTER_GAIN = 0.9;
const SILENCE = 0.0001;
const HOVER_INTERVAL_MS = 70;
const KEYBOARD_GRACE_MS = 500;
const PENDING_TTL_MS = 400;
const UNLOCK_EVENTS = [
  "pointerdown",
  "pointerup",
  "touchend",
  "mousedown",
  "keydown",
  "click",
] as const;

interface Bus {
  ctx: AudioContext;
  master: GainNode;
  noise: AudioBuffer;
}

let bus: Bus | null = null;
let armed = false;
let pending: { at: number; voice: () => void } | null = null;
let lastHover = 0;
let lastPointer = 0;

function whiteNoise(ctx: AudioContext) {
  const length = Math.ceil(ctx.sampleRate * 0.25);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function isRunning(ctx: AudioContext) {
  // iOS also reports a non-standard "interrupted" state; treat it as parked.
  return ctx.state === "running";
}

/**
 * Resume from inside a gesture. Starting a one-frame silent source is the
 * belt to `resume()`'s braces: Chrome also unblocks a context when a source
 * starts during a gesture, and older WebKit only unlocks on a played buffer.
 */
function unlock() {
  const ctx = bus?.ctx;
  if (!ctx || isRunning(ctx)) {
    return;
  }
  ctx.resume().catch(() => undefined);
  try {
    const kick = ctx.createBufferSource();
    kick.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    kick.connect(ctx.destination);
    kick.start(0);
  } catch {
    // Nothing to do; resume() alone is enough on current engines.
  }
}

function arm() {
  if (armed) {
    return;
  }
  armed = true;
  for (const type of UNLOCK_EVENTS) {
    document.addEventListener(type, unlock, { capture: true, passive: true });
  }
}

function disarm() {
  if (!armed) {
    return;
  }
  armed = false;
  for (const type of UNLOCK_EVENTS) {
    document.removeEventListener(type, unlock, { capture: true });
  }
}

function openBus(): Bus | null {
  if (bus) {
    return bus;
  }
  if (typeof window === "undefined" || !window.AudioContext) {
    return null;
  }
  const ctx = new AudioContext({ latencyHint: "interactive" });
  const master = ctx.createGain();
  master.gain.value = MASTER_GAIN;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.knee.value = 12;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.002;
  compressor.release.value = 0.08;
  master.connect(compressor);
  compressor.connect(ctx.destination);
  bus = { ctx, master, noise: whiteNoise(ctx) };

  // Whenever the context parks (autoplay, iOS interruption, tab discard) the
  // next gesture re-opens it; once it runs the listeners come off again.
  const sync = () => {
    if (!isRunning(ctx)) {
      arm();
      return;
    }
    disarm();
    const held = pending;
    pending = null;
    if (held && performance.now() - held.at < PENDING_TTL_MS) {
      held.voice();
    }
  };
  ctx.addEventListener("statechange", sync);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && !isRunning(ctx)) {
      ctx.resume().catch(() => undefined);
    }
  });
  sync();
  return bus;
}

/**
 * Voices only schedule against a running clock. While the context is parked
 * its `currentTime` is frozen, so anything scheduled then would pile up at
 * the same instant and fire as one loud blip on resume. Instead the latest
 * voice is held until `statechange` reports the clock running (a tap's
 * `touchend` lands within the TTL); anything older is dropped as stale.
 */
function play(voice: () => void) {
  const live = openBus();
  if (!live) {
    return;
  }
  if (isRunning(live.ctx)) {
    voice();
    return;
  }
  pending = { at: performance.now(), voice };
  unlock();
}

interface Tone {
  /** Attack in seconds; longer softens the onset. */
  attack?: number;
  /** Low-pass cutoff in Hz; tames square and triangle waves. */
  cutoff?: number;
  duration: number;
  from: number;
  gain: number;
  to?: number;
  wave: OscillatorType;
  when?: number;
}

function tone({
  attack = 0.003,
  cutoff,
  duration,
  from,
  gain: peak,
  to = from,
  wave,
  when = 0,
}: Tone) {
  const live = openBus();
  if (!live) {
    return;
  }
  const { ctx, master } = live;
  const now = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(from, now);
  if (to !== from) {
    osc.frequency.exponentialRampToValueAtTime(to, now + duration);
  }
  gain.gain.setValueAtTime(SILENCE, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + attack);
  gain.gain.exponentialRampToValueAtTime(SILENCE, now + duration);

  let head: AudioNode = osc;
  if (cutoff) {
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    head.connect(filter);
    head = filter;
  }
  head.connect(gain);
  gain.connect(master);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

interface Click {
  duration: number;
  frequency: number;
  gain: number;
  /** Where the band-pass ends; a sweep reads as a "whoosh". */
  to?: number;
  when?: number;
}

/** A burst of filtered noise: the mechanical part of a key press. */
function click({ duration, frequency, gain: peak, to, when = 0 }: Click) {
  const live = openBus();
  if (!live) {
    return;
  }
  const { ctx, master, noise } = live;
  const now = ctx.currentTime + when;
  const source = ctx.createBufferSource();
  source.buffer = noise;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 0.9;
  filter.frequency.setValueAtTime(frequency, now);
  if (to) {
    filter.frequency.exponentialRampToValueAtTime(to, now + duration);
  }
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(SILENCE, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.001);
  gain.gain.exponentialRampToValueAtTime(SILENCE, now + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  source.start(now);
  source.stop(now + duration + 0.02);
}

/* ---------- palette ----------
 * Loudness is a hierarchy: hover is a whisper, press is the anchor, and the
 * confirmations (switch, theme, sound on/off) are melodic so they read as
 * "something changed" rather than "something was pressed".
 */

/** Low woody tock: buttons and outbound links. */
function playPress() {
  click({ duration: 0.012, frequency: 2600, gain: 0.1 });
  tone({
    cutoff: 1600,
    duration: 0.06,
    from: 420,
    gain: 0.22,
    to: 170,
    wave: "square",
  });
}

/** Same tock, higher and lighter: moving to another page of this site. */
function playNav() {
  click({ duration: 0.01, frequency: 3200, gain: 0.08 });
  tone({
    cutoff: 2000,
    duration: 0.05,
    from: 620,
    gain: 0.18,
    to: 300,
    wave: "square",
  });
}

/** Faint glass tick for pointer hover; rate-limited by the caller. */
function playHover() {
  tone({
    duration: 0.018,
    from: 1500,
    gain: 0.045,
    to: 1300,
    wave: "sine",
  });
}

/** Keyboard focus landing: a short round tone, no transient. */
function playFocus() {
  tone({
    attack: 0.005,
    duration: 0.045,
    from: 720,
    gain: 0.08,
    wave: "triangle",
  });
}

/** Two rising notes: a setting flipped (locale, sort). */
function playSwitch() {
  tone({
    cutoff: 2200,
    duration: 0.045,
    from: 440,
    gain: 0.16,
    wave: "square",
  });
  tone({
    cutoff: 2200,
    duration: 0.06,
    from: 587,
    gain: 0.16,
    wave: "square",
    when: 0.055,
  });
}

/** Paper flip: a noise sweep under a rising triangle, for the theme toggle. */
function playFlip() {
  click({ duration: 0.16, frequency: 500, gain: 0.12, to: 2600 });
  tone({
    attack: 0.01,
    duration: 0.14,
    from: 330,
    gain: 0.14,
    to: 660,
    wave: "triangle",
  });
}

/** Sound off: two falling notes. */
function playFall() {
  tone({ duration: 0.06, from: 587, gain: 0.18, wave: "triangle" });
  tone({
    duration: 0.09,
    from: 392,
    gain: 0.18,
    wave: "triangle",
    when: 0.065,
  });
}

/** Sound on: a major arpeggio, the one melodic flourish in the palette. */
function playRise() {
  const notes = [523, 659, 784];
  notes.forEach((frequency, index) => {
    tone({
      duration: index === notes.length - 1 ? 0.11 : 0.06,
      from: frequency,
      gain: 0.18,
      wave: "triangle",
      when: index * 0.06,
    });
  });
}

function controlOf(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }
  return target.closest(INTERACTIVE);
}

function isSiteLink(el: Element) {
  if (!(el instanceof HTMLAnchorElement) || el.target === "_blank") {
    return false;
  }
  return el.origin === window.location.origin;
}

function voiceFor(el: Element) {
  const voice = el.closest<HTMLElement>("[data-sound]")?.dataset.sound;
  switch (voice) {
    case "switch":
      return playSwitch;
    case "theme":
      return playFlip;
    case "press":
      return playPress;
    default:
      return isSiteLink(el) ? playNav : playPress;
  }
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "0") {
        setEnabled(false);
      }
    } catch {
      // private mode
    }
  }, []);

  useEffect(() => {
    // Build the graph now so the first press only pays for the resume.
    openBus();

    const onOver = (event: PointerEvent) => {
      // Touch fires pointerover right before pointerdown; only mice hover.
      if (!enabledRef.current || event.pointerType !== "mouse") {
        return;
      }
      // Hover is not a gesture, so it can never wake the bus; a whisper that
      // would fire late on the next click is worse than none.
      if (!(bus && isRunning(bus.ctx))) {
        return;
      }
      const next = controlOf(event.target);
      if (!(next && next !== controlOf(event.relatedTarget))) {
        return;
      }
      const now = performance.now();
      if (now - lastHover < HOVER_INTERVAL_MS) {
        return;
      }
      lastHover = now;
      playHover();
    };

    const onDown = (event: PointerEvent) => {
      if (!enabledRef.current) {
        return;
      }
      const el = controlOf(event.target);
      if (!el) {
        return;
      }
      lastPointer = performance.now();
      if (el.closest("[data-sound-toggle]")) {
        play(playFall);
        return;
      }
      play(voiceFor(el));
    };

    const onFocus = (event: FocusEvent) => {
      if (!enabledRef.current) {
        return;
      }
      if (performance.now() - lastPointer < KEYBOARD_GRACE_MS) {
        return;
      }
      if (!controlOf(event.target)) {
        return;
      }
      play(playFocus);
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("focusin", onFocus);
    };
  }, []);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // private mode
    }
    if (next) {
      play(playRise);
    }
  }, []);

  return <SoundContext value={{ enabled, toggle }}>{children}</SoundContext>;
}

export function SoundToggle() {
  const t = useTranslations("hero");
  const sound = use(SoundContext);
  if (!sound) {
    return null;
  }

  return (
    <button
      aria-label={sound.enabled ? t("soundOn") : t("soundOff")}
      aria-pressed={sound.enabled}
      className="icon-control"
      data-sound-toggle=""
      onClick={sound.toggle}
      type="button"
    >
      <SpeakerIcon muted={!sound.enabled} />
    </button>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
      <path
        d="M3 6.5h2.2L8.5 3.8v8.4L5.2 9.5H3V6.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      {muted ? (
        <path
          d="M11 6.2 14 9.2M14 6.2 11 9.2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.2"
        />
      ) : (
        <path
          d="M11 6.2a2.6 2.6 0 0 1 0 3.6M12.6 4.8a4.4 4.4 0 0 1 0 6.4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.2"
        />
      )}
    </svg>
  );
}
