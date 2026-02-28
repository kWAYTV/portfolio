"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";

export function useThemeTransition(duration = 300) {
  const { setTheme } = useTheme();

  const setThemeWithTransition = useCallback(
    async (theme: "light" | "dark") => {
      const applyTheme = () => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
        setTheme(theme);
      };

      const svt = (
        document as Document & {
          startViewTransition?: (cb: () => void) => { ready: Promise<void> };
        }
      ).startViewTransition;

      if (typeof svt === "function") {
        const transition = svt.call(document, applyTheme);
        await transition.ready;

        const easing = "cubic-bezier(0.32, 0.72, 0, 1)";

        document.documentElement.animate(
          { opacity: [0, 1] },
          { duration, easing, pseudoElement: "::view-transition-new(root)" }
        );
        document.documentElement.animate(
          { opacity: [1, 0] },
          { duration, easing, pseudoElement: "::view-transition-old(root)" }
        );
      } else {
        applyTheme();
      }
    },
    [setTheme, duration]
  );

  return setThemeWithTransition;
}
