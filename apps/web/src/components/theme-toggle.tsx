"use client";

import { analytics } from "@repo/analytics";
import { useTranslations } from "next-intl";
import { type MouseEvent, useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { ThemeIcon } from "@/components/icons";
import { useTheme } from "@/modules/theming/components/theme-provider";

const FLIP_CLASS = "theme-flip";
const FLIP_MS = 420;
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Swap theme behind a circular wipe that grows from the toggle. The `theme-flip`
 * class (see index.css) turns the default cross-fade off and un-anchors the
 * masthead so the whole page is one snapshot. */
function flipTheme(origin: HTMLElement, apply: () => void) {
  if (
    typeof document.startViewTransition !== "function" ||
    window.matchMedia(REDUCED_MOTION).matches
  ) {
    apply();
    return;
  }

  const root = document.documentElement;
  const rect = origin.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  root.classList.add(FLIP_CLASS);
  const transition = document.startViewTransition(() => flushSync(apply));

  transition.ready
    .then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: FLIP_MS,
          easing: EASE_OUT,
          pseudoElement: "::view-transition-new(root)",
        }
      );
    })
    .catch(() => {
      // The transition was skipped; the theme is already applied.
    });

  transition.finished.finally(() => root.classList.remove(FLIP_CLASS));
}

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
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      flipTheme(event.currentTarget, () => setTheme?.(nextTheme));
      analytics.themeToggle(nextTheme);
    },
    [nextTheme, setTheme]
  );

  return (
    <button
      aria-label={t(nextTheme)}
      aria-pressed={isDark}
      className="control icon-control"
      data-sound="theme"
      onClick={handleClick}
      title={t(nextTheme)}
      type="button"
    >
      <ThemeIcon className="dial" />
    </button>
  );
}
