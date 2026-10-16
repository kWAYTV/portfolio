"use client";

import { analytics } from "@repo/analytics";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { ThemeIcon } from "@/components/icons";
import { useTheme } from "@/modules/theming/components/theme-provider";

export function ThemeToggle() {
  const theme = useTheme();
  const resolvedTheme = theme?.resolvedTheme;
  const setTheme = theme?.setTheme;
  const t = useTranslations("theme");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const handleClick = useCallback(() => {
    setTheme?.(nextTheme);
    analytics.themeToggle(nextTheme);
  }, [nextTheme, setTheme]);

  return (
    <button
      aria-label={t(nextTheme)}
      aria-pressed={isDark}
      className="control icon-control"
      data-sound="switch"
      onClick={handleClick}
      title={t(nextTheme)}
      type="button"
    >
      <ThemeIcon className="dial" />
    </button>
  );
}
