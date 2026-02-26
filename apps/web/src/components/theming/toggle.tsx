"use client";

import { analytics } from "@portfolio/analytics";
import { cn } from "@portfolio/ui";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";
import { flushSync } from "react-dom";

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export const ThemeToggle = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = resolvedTheme === "dark";

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    const newTheme = isDark ? "light" : "dark";

    const svt = (document as unknown as { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }).startViewTransition;
    const transition =
      typeof svt === "function"
        ? svt(() => {
            flushSync(() => setTheme(newTheme));
          })
        : { ready: Promise.resolve() };

    await transition.ready;

    analytics.themeToggle(newTheme);

    if (typeof svt === "function" && buttonRef.current) {
      const { top, left } = buttonRef.current.getBoundingClientRect();
      const x = left + 12;
      const y = top + 12;
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
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
  }, [isDark, setTheme, duration]);

  return (
    <button
      className={cn(
        "flex cursor-pointer items-center gap-1 text-muted-foreground/50 text-xs transition-colors duration-200 hover:text-foreground sm:text-sm",
        className
      )}
      onClick={toggleTheme}
      ref={buttonRef}
      {...props}
    >
      {isDark ? (
        <Sun className="size-3.5 shrink-0" />
      ) : (
        <Moon className="size-3.5 shrink-0" />
      )}
      <span className="hidden sm:inline">{isDark ? t("light") : t("dark")}</span>
    </button>
  );
};
