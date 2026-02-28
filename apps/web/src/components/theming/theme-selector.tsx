"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { THEME_PRESETS, type ThemePresetId } from "@/lib/theme-config";
import { useActiveTheme } from "./active-theme-provider";

export function ThemeSelector() {
  const t = useTranslations("ide");
  const { activeTheme, setActiveTheme } = useActiveTheme();

  return (
    <Select
      onValueChange={(v) => setActiveTheme(v as ThemePresetId)}
      value={activeTheme}
    >
      <SelectTrigger
        className="h-7 w-full justify-between border-transparent bg-transparent text-xs"
        size="sm"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start">
        {THEME_PRESETS.map(({ id }) => (
          <SelectItem key={id} value={id}>
            {t(`themePreset_${id}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
