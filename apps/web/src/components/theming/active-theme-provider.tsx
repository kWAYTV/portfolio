"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DEFAULT_THEME,
  THEME_PRESETS,
  type ThemePresetId,
} from "@/lib/theme-config";

const COOKIE_NAME = "portfolio_theme";

function getThemeFromCookie(): ThemePresetId {
  if (typeof document === "undefined") {
    return DEFAULT_THEME;
  }
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  );
  const value = match?.[1];
  const valid = THEME_PRESETS.some((t) => t.id === value);
  return (valid ? value : DEFAULT_THEME) as ThemePresetId;
}

function setThemeCookie(theme: ThemePresetId) {
  if (typeof window === "undefined") {
    return;
  }
  // biome-ignore lint/suspicious/noDocumentCookie: Theme persistence; document.cookie has wider support than Cookie Store API
  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${
    window.location.protocol === "https:" ? "Secure;" : ""
  }`;
}

interface ActiveThemeContextType {
  activeTheme: ThemePresetId;
  setActiveTheme: (theme: ThemePresetId) => void;
}

const ActiveThemeContext = createContext<ActiveThemeContextType | undefined>(
  undefined
);

export function ActiveThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme?: ThemePresetId;
}) {
  const [activeTheme, setActiveThemeState] = useState<ThemePresetId>(
    () => initialTheme ?? getThemeFromCookie()
  );

  const setActiveTheme = useCallback((theme: ThemePresetId) => {
    setActiveThemeState(theme);
    setThemeCookie(theme);
  }, []);

  useEffect(() => {
    setThemeCookie(activeTheme);

    for (const { id } of THEME_PRESETS) {
      document.documentElement.classList.remove(`theme-${id}`);
    }
    document.documentElement.classList.add(`theme-${activeTheme}`);
  }, [activeTheme]);

  return (
    <ActiveThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ActiveThemeContext.Provider>
  );
}

export function useActiveTheme() {
  const context = useContext(ActiveThemeContext);
  if (context === undefined) {
    throw new Error(
      "useActiveTheme must be used within an ActiveThemeProvider"
    );
  }
  return context;
}
