"use client";

import { analytics } from "@repo/analytics";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const handleClick = useCallback(() => {
    setTheme(nextTheme);
    analytics.themeToggle(nextTheme);
  }, [nextTheme, setTheme]);

  return (
    <button
      aria-pressed={isDark}
      className="control"
      onClick={handleClick}
      type="button"
    >
      {mounted ? t(nextTheme) : t("dark")}
    </button>
  );
}
