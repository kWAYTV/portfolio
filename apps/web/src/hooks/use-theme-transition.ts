"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";
import { themeTransition } from "@/lib/theme-transitions";

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

        themeTransition(duration, {
          old: "::view-transition-old(root)",
          newView: "::view-transition-new(root)",
        });
      } else {
        applyTheme();
      }
    },
    [setTheme, duration]
  );

  return setThemeWithTransition;
}
