"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { useThemeTransition } from "@/hooks/use-theme-transition";
import { cn } from "@/lib/utils";

interface ThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export function ThemeToggle({
  className,
  duration = 300,
  ...props
}: ThemeToggleProps) {
  const t = useTranslations("theme");
  const { resolvedTheme } = useTheme();
  const setThemeWithTransition = useThemeTransition(duration);
  const [isDark, setIsDark] = useState(false);

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
    await setThemeWithTransition(isDark ? "light" : "dark");
  }, [isDark, setThemeWithTransition]);

  return (
    <button
      aria-label={isDark ? t("light") : t("dark")}
      className={cn(
        "flex cursor-pointer items-center gap-1 text-muted-foreground/50 text-xs transition-colors duration-200 hover:text-foreground sm:text-sm",
        className
      )}
      onClick={handleClick}
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
}
