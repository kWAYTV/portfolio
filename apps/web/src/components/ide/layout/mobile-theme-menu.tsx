"use client";

import {
  THEME_PRESETS,
  type ThemePreset,
  useThemePreset,
} from "@/components/theming/theme-preset-context";
import { useThemeTransition } from "@/components/theming/use-theme-transition";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@portfolio/ui";
import { Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { memo } from "react";

export const MobileThemeMenu = memo(function MobileThemeMenu() {
  const t = useTranslations("ide");
  const { resolvedTheme } = useTheme();
  const { preset, setPreset } = useThemePreset();
  const setThemeWithTransition = useThemeTransition();
  const isDark = resolvedTheme === "dark";

  const handleLightDark = () => {
    void setThemeWithTransition(isDark ? "light" : "dark");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50 text-foreground"
          type="button"
        >
          <span className="flex items-center gap-3">
            <Palette className="size-4 shrink-0" />
            <span>{t("themePreset")}</span>
          </span>
          <span className="text-muted-foreground text-xs">
            {t(`themePreset_${preset}`)}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="ide-dropdown w-56 rounded-sm border border-border bg-popover p-0.5 shadow-lg"
        side="right"
        sideOffset={8}
      >
        <button
          className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={handleLightDark}
          type="button"
        >
          {isDark ? (
            <>
              <Sun className="size-3.5" />
              {t("lightTheme")}
            </>
          ) : (
            <>
              <Moon className="size-3.5" />
              {t("darkTheme")}
            </>
          )}
        </button>
        <DropdownMenuSeparator className="my-0.5" />
        <DropdownMenuRadioGroup
          onValueChange={(v) => setPreset(v as ThemePreset)}
          value={preset}
        >
          {THEME_PRESETS.map((p) => (
            <DropdownMenuRadioItem
              className="cursor-pointer"
              key={p}
              value={p}
            >
              {t(`themePreset_${p}`)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
