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

const SoundContext = createContext<{
  enabled: boolean;
  toggle: () => void;
} | null>(null);

let audioCtx: AudioContext | null = null;

function playClick() {
  const AudioCtx = window.AudioContext;
  if (!AudioCtx) {
    return;
  }
  const ctx = audioCtx ?? new AudioCtx();
  audioCtx = ctx;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => undefined);
  }
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(210, now);
  osc.frequency.exponentialRampToValueAtTime(90, now + 0.035);
  gain.gain.setValueAtTime(0.035, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.045);
}

function isClickable(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }
  if (target.closest("[data-sound-toggle], input, textarea, select")) {
    return false;
  }
  return Boolean(target.closest("a, button, [role='button']"));
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
    const onPointer = (event: PointerEvent) => {
      if (!(enabledRef.current && isClickable(event.target))) {
        return;
      }
      playClick();
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);

  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // private mode
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
