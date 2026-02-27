"use client";

import { cn } from "@portfolio/ui";
import { ChevronDown, Moon, Palette, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { memo, useState } from "react";
import {
  THEME_PRESETS,
  useThemePreset,
} from "@/components/theming/theme-preset-context";
import { useThemeTransition } from "@/components/theming/use-theme-transition";

export const MobileThemeMenu = memo(function MobileThemeMenu() {
  const t = useTranslations("ide");
  const { resolvedTheme } = useTheme();
  const { preset, setPreset } = useThemePreset();
  const setThemeWithTransition = useThemeTransition();
  const isDark = resolvedTheme === "dark";
  const [expanded, setExpanded] = useState(false);

  const handleLightDark = () => {
    void setThemeWithTransition(isDark ? "light" : "dark");
  };

  return (
    <div className="flex flex-col">
      <button
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-foreground text-sm transition-colors hover:bg-muted/50"
        onClick={() => setExpanded((e) => !e)}
        type="button"
      >
        <span className="flex items-center gap-3">
          <Palette className="size-4 shrink-0" />
          <span>{t("themePreset")}</span>
        </span>
        <span className="flex items-center gap-2 text-muted-foreground text-xs">
          {t(`themePreset_${preset}`)}
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </span>
      </button>
      {expanded && (
        <div className="border-border border-t bg-muted/30 px-4 py-2">
          <button
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50"
            onClick={handleLightDark}
            type="button"
          >
            {isDark ? (
              <>
                <Sun className="size-4 shrink-0" />
                {t("lightTheme")}
              </>
            ) : (
              <>
                <Moon className="size-4 shrink-0" />
                {t("darkTheme")}
              </>
            )}
          </button>
          <div className="mt-1">
            <span className="px-3 text-[10px] text-muted-foreground uppercase tracking-wider">
              {t("themePreset")}
            </span>
            <div className="mt-1 flex flex-col gap-0.5">
              {THEME_PRESETS.map((p) => (
                <button
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    preset === p
                      ? "bg-muted/80 text-foreground"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                  key={p}
                  onClick={() => setPreset(p)}
                  type="button"
                >
                  {t(`themePreset_${p}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
