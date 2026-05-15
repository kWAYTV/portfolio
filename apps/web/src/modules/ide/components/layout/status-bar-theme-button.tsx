"use client";

import { analytics } from "@repo/analytics";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { useThemeTransition } from "@/modules/theming/hooks/use-theme-transition";

export function StatusBarThemeButton() {
  const t = useTranslations("ide");
  const tTheme = useTranslations("theme");
  const { resolvedTheme } = useTheme();
  const setThemeWithTransition = useThemeTransition(280);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleToggle = useCallback(async () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    analytics.themeToggle(next);
    await setThemeWithTransition(next);
  }, [resolvedTheme, setThemeWithTransition]);

  const isDark = resolvedTheme === "dark";

  let label: string;
  if (!mounted) {
    label = t("toggleTheme");
  } else if (isDark) {
    label = t("lightTheme");
  } else {
    label = t("darkTheme");
  }

  const text = mounted && isDark ? tTheme("dark") : tTheme("light");

  let icon: React.ReactNode;
  if (!mounted) {
    icon = (
      <span
        aria-hidden
        className="size-3.5 shrink-0"
        style={{ width: 14, height: 14 }}
      />
    );
  } else if (isDark) {
    icon = <Sun className="size-3.5 shrink-0" />;
  } else {
    icon = <Moon className="size-3.5 shrink-0" />;
  }

  return (
    <button
      aria-label={label}
      className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
      onClick={handleToggle}
      type="button"
    >
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
}
