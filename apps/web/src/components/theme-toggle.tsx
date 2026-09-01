"use client";

import { analytics } from "@repo/analytics";
import { motion } from "motion/react";
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
      aria-label={t(nextTheme)}
      aria-pressed={isDark}
      className="control dial"
      onClick={handleClick}
      title={t(nextTheme)}
      type="button"
    >
      <motion.svg
        animate={{ rotate: isDark ? 180 : 0 }}
        aria-hidden="true"
        height="14"
        transition={{ bounce: 0.15, duration: 0.45, type: "spring" }}
        viewBox="0 0 14 14"
        width="14"
      >
        <circle
          cx="7"
          cy="7"
          fill="none"
          r="6.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M7 0.75 A6.25 6.25 0 0 1 7 13.25 Z" fill="currentColor" />
      </motion.svg>
    </button>
  );
}
