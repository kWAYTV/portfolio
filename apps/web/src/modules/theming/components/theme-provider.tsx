"use client";

import { createContext, use, useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";
const MEDIA = "(prefers-color-scheme: dark)";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

const ThemeContext = createContext<{
  resolvedTheme: ResolvedTheme | undefined;
  setTheme: (theme: Theme) => void;
} | null>(null);

function systemTheme(): ResolvedTheme {
  return window.matchMedia(MEDIA).matches ? "dark" : "light";
}

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    return "system";
  }
  return "system";
}

function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme | null>(null);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme | undefined>(
    undefined
  );

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    const resolved = next === "system" ? systemTheme() : next;
    setResolvedTheme(resolved);
    applyTheme(resolved);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing and disabled storage throw.
    }
  }, []);

  useEffect(() => {
    setThemeState(readTheme());

    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }
      setThemeState(readTheme());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!theme) {
      return;
    }

    const resolved = theme === "system" ? systemTheme() : theme;
    setResolvedTheme(resolved);
    applyTheme(resolved);

    if (theme !== "system") {
      return;
    }

    const media = window.matchMedia(MEDIA);
    const onChange = () => {
      const next = systemTheme();
      setResolvedTheme(next);
      applyTheme(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  return (
    <ThemeContext value={{ resolvedTheme, setTheme }}>{children}</ThemeContext>
  );
}

export function useTheme() {
  return use(ThemeContext);
}
