"use client";

import {
  THEME_PRESETS,
  type ThemePreset,
  useThemePreset,
} from "@/components/theming/theme-preset-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@portfolio/ui";
import { Palette } from "lucide-react";
import { useTranslations } from "next-intl";

export function ThemeSelector() {
  const { preset, setPreset } = useThemePreset();
  const t = useTranslations("ide");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={t("themePreset")}
          className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-muted-foreground/50 text-xs transition-colors duration-200 hover:text-foreground sm:text-sm"
          type="button"
        >
          <Palette className="size-3.5 shrink-0" />
          <span aria-hidden>{t(`themePreset_${preset}`)}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="ide-dropdown min-w-[8rem] rounded-sm border border-border bg-popover p-0.5 shadow-lg"
        sideOffset={4}
      >
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
}
