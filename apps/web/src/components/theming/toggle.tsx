"use client";

import { analytics } from "@portfolio/analytics";
import { cn } from "@portfolio/ui";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { useThemeTransition } from "@/components/theming/use-theme-transition";

interface ThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export const ThemeToggle = ({
  className,
  duration = 400,
  ...props
}: ThemeToggleProps) => {
  const t = useTranslations("theme");
  const { resolvedTheme } = useTheme();
  const setThemeWithTransition = useThemeTransition(duration);
  // Always false on initial render to avoid hydration mismatch (resolvedTheme is undefined on server)
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback(async () => {
    const newTheme = isDark ? "light" : "dark";
    const rect = buttonRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined;
    await setThemeWithTransition(newTheme, origin);
    analytics.themeToggle(newTheme);
  }, [isDark, setThemeWithTransition]);

  return (
    <button
      className={cn(
        "flex cursor-pointer items-center gap-1 text-muted-foreground/50 text-xs transition-colors duration-200 hover:text-foreground sm:text-sm",
        className
      )}
      onClick={handleClick}
      ref={buttonRef}
      type="button"
      {...props}
    >
      {isDark ? (
        <Sun className="size-3.5 shrink-0" />
      ) : (
        <Moon className="size-3.5 shrink-0" />
      )}
      <span className="hidden sm:inline">
        {isDark ? t("light") : t("dark")}
      </span>
    </button>
  );
};
