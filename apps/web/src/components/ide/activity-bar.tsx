"use client";

import { updateLocale } from "@i18n/lib/update-locale";
import { getPathname, routing } from "@i18n/routing";
import type { Locale } from "@portfolio/i18n/config";
import { localeNames, localeToFlagEmoji } from "@portfolio/i18n/config";
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@portfolio/ui";
import {
  GitBranch,
  Languages,
  Moon,
  PanelLeft,
  Palette,
  Settings,
  Sun,
  Terminal,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { memo, useRef, useState } from "react";
import {
  THEME_PRESETS,
  type ThemePreset,
  useThemePreset,
} from "@/components/theming/theme-preset-context";
import { useThemeTransition } from "@/components/theming/use-theme-transition";

const PORTFOLIO_REPO_URL = "https://github.com/kWAYTV/portfolio";

interface ActivityBarProps {
  onOpenCommand: () => void;
  onToggleSidebar: () => void;
  onToggleTerminal: () => void;
  pathname: string;
  sidebarOpen: boolean;
  terminalOpen: boolean;
}

export const ActivityBar = memo(function ActivityBar({
  pathname,
  sidebarOpen,
  terminalOpen,
  onOpenCommand,
  onToggleSidebar,
  onToggleTerminal,
}: ActivityBarProps) {
  const { resolvedTheme } = useTheme();
  const { preset, setPreset } = useThemePreset();
  const setThemeWithTransition = useThemeTransition();
  const settingsTriggerRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("ide");
  const locale = useLocale() as Locale;
  const [localePending, setLocalePending] = useState(false);
  const isDark = resolvedTheme === "dark";

  const handleLocaleChange = async (newLocale: string) => {
    const loc = newLocale as Locale;
    if (loc === locale || localePending) {
      return;
    }
    setLocalePending(true);
    try {
      await updateLocale(loc);
      const targetPath = getPathname({ href: pathname, locale: loc });
      window.location.assign(targetPath);
    } catch {
      setLocalePending(false);
    }
  };

  const handleThemeToggle = () => {
    const rect = settingsTriggerRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined;
    void setThemeWithTransition(isDark ? "light" : "dark", origin);
  };

  return (
    <div className="flex h-full w-12 shrink-0 select-none flex-col items-center border-border border-r bg-sidebar py-1 shadow-[var(--shadow-elevation-sm)]">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "flex size-10 cursor-pointer items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary",
              sidebarOpen && "text-sidebar-primary"
            )}
            onClick={onToggleSidebar}
            type="button"
          >
            <PanelLeft className="size-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{t("explorer")}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <a
            className="flex size-10 cursor-pointer items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary"
            href={PORTFOLIO_REPO_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitBranch className="size-5" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="right">{t("openRepo")}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "flex size-10 cursor-pointer items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary",
              terminalOpen && "text-sidebar-primary"
            )}
            onClick={onToggleTerminal}
            type="button"
          >
            <Terminal className="size-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{t("terminal")}</TooltipContent>
      </Tooltip>

      <div className="mt-auto">
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex size-10 cursor-pointer items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary"
                  ref={settingsTriggerRef}
                  type="button"
                >
                  <Settings className="size-5" />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">{t("settings")}</TooltipContent>
          </Tooltip>
          <DropdownMenuContent
            align="start"
            className="ide-dropdown w-44 rounded-sm border border-border bg-popover p-0.5 shadow-lg"
            side="right"
          >
            <DropdownMenuItem onClick={handleThemeToggle}>
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
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-0.5" />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="pl-8">
                <Palette className="size-3.5" />
                {t("themePreset")}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="ide-dropdown w-44 rounded-sm border border-border bg-popover p-0.5 shadow-lg"
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
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator className="my-0.5" />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="pl-8" disabled={localePending}>
                <Languages className="size-3.5" />
                {t("language")}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="ide-dropdown w-44 rounded-sm border border-border bg-popover p-0.5 shadow-lg"
                sideOffset={4}
              >
                <DropdownMenuRadioGroup
                  onValueChange={handleLocaleChange}
                  value={locale}
                >
                  {routing.locales.map((loc) => (
                    <DropdownMenuRadioItem
                      className="cursor-pointer"
                      key={loc}
                      value={loc}
                    >
                      <span aria-hidden className="mr-2">
                        {localeToFlagEmoji(loc as Locale)}
                      </span>
                      {localeNames[loc as Locale]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator className="my-0.5" />
            <DropdownMenuItem onClick={onOpenCommand}>
              <span>{t("commandPalette")}</span>
              <DropdownMenuShortcut>
                {t("commandPaletteShortcut")}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
});
