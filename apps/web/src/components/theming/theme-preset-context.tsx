"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "ide-theme-preset";

export const THEME_PRESETS = [
  "default",
  "catppuccin",
  "violet-bloom",
  "caffeine",
] as const;
export type ThemePreset = (typeof THEME_PRESETS)[number];

interface ThemePresetContextValue {
  preset: ThemePreset;
  setPreset: (preset: ThemePreset) => void;
}

const ThemePresetContext = createContext<ThemePresetContextValue | null>(null);

function getStoredPreset(): ThemePreset {
  if (typeof window === "undefined") return "default";
  const stored = localStorage.getItem(STORAGE_KEY);
  return THEME_PRESETS.includes(stored as ThemePreset)
    ? (stored as ThemePreset)
    : "default";
}

function syncToDom(preset: ThemePreset) {
  const el = document.documentElement;
  if (preset === "default") {
    delete el.dataset.theme;
  } else {
    el.dataset.theme = preset;
  }
}

export function ThemePresetProvider({ children }: { children: React.ReactNode }) {
  const [preset, setPresetState] = useState<ThemePreset>("default");

  useEffect(() => {
    const stored = getStoredPreset();
    setPresetState(stored);
    syncToDom(stored);
  }, []);

  const setPreset = useCallback((next: ThemePreset) => {
    setPresetState(next);
    localStorage.setItem(STORAGE_KEY, next);
    syncToDom(next);
  }, []);

  return (
    <ThemePresetContext.Provider value={{ preset, setPreset }}>
      {children}
    </ThemePresetContext.Provider>
  );
}

export function useThemePreset() {
  const ctx = useContext(ThemePresetContext);
  if (!ctx) {
    return {
      preset: "default" as ThemePreset,
      setPreset: () => {},
    };
  }
  return ctx;
}
