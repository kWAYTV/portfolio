"use client";

import { analytics } from "@portfolio/analytics";
import { cn } from "@portfolio/ui";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

interface ThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {}

export const ThemeToggle = ({ className, ...props }: ThemeToggleProps) => {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleClick = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    analytics.themeToggle(newTheme);
  };

  return (
    <button
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
      <span className="hidden sm:inline">{isDark ? t("light") : t("dark")}</span>
    </button>
  );
};
