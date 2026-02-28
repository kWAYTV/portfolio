"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";
import { flushSync } from "react-dom";

export function useThemeTransition(duration = 400) {
  const { setTheme } = useTheme();

  const setThemeWithTransition = useCallback(
    async (theme: "light" | "dark", origin?: { x: number; y: number }) => {
      const runTransition = () => {
        flushSync(() => setTheme(theme));
      };

      const svt = (
        document as Document & {
          startViewTransition?: (cb: () => void) => { ready: Promise<void> };
        }
      ).startViewTransition;
      if (typeof svt === "function") {
        const transition = svt.call(document, runTransition);
        await transition.ready;

        if (origin) {
          const { x, y } = origin;
          const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
          );

          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration,
              easing: "ease-in-out",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        }
      } else {
        runTransition();
      }
    },
    [setTheme, duration]
  );

  return setThemeWithTransition;
}
