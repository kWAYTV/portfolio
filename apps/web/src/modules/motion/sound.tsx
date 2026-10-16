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

let audioCtx: AudioContext | null = null;
let lastHover = 0;
let lastPointer = 0;

function context() {
  const AudioCtx = window.AudioContext;
  if (!AudioCtx) {
    return null;
  }
  const ctx = audioCtx ?? new AudioCtx();
  audioCtx = ctx;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => undefined);
  }
  return ctx;
}

function blip(
  from: number,
  to: number,
  gainValue: number,
  duration: number,
  when = 0
) {
  const ctx = context();
  if (!ctx) {
    return;
  }
  const now = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), now + duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playPress() {
  blip(460, 240, 0.018, 0.04);
}

function playHover() {
  blip(920, 760, 0.007, 0.02);
}

function playFocus() {
  blip(540, 540, 0.01, 0.032);
}

function playSwitch() {
  blip(480, 480, 0.012, 0.03);
  blip(720, 720, 0.01, 0.04, 0.045);
}

function playFall() {
  blip(640, 220, 0.014, 0.07);
}

function playRise() {
  blip(280, 640, 0.014, 0.07);
}

function controlOf(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }
  return target.closest(INTERACTIVE);
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
    const onOver = (event: PointerEvent) => {
      if (!enabledRef.current) {
        return;
      }
      const next = controlOf(event.target);
      if (!(next && next !== controlOf(event.relatedTarget))) {
        return;
      }
      const now = performance.now();
      if (now - lastHover < 70) {
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
        playFall();
        return;
      }
      if (el.closest("[data-sound='switch']")) {
        playSwitch();
        return;
      }
      playPress();
    };

    const onFocus = (event: FocusEvent) => {
      if (!enabledRef.current) {
        return;
      }
      if (performance.now() - lastPointer < 500) {
        return;
      }
      if (!controlOf(event.target)) {
        return;
      }
      playFocus();
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
    setEnabled((current) => {
      const next = !current;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // private mode
      }
      if (next) {
        playRise();
      }
      return next;
    });
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
