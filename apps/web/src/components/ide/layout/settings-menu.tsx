"use client";

import { config, type Locale, localeToFlagEmoji } from "@repo/i18n/config";
import { ExternalLink, Languages, Palette, Settings } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ThemeSelector } from "@/components/theming/theme-selector";
import { ThemeToggle } from "@/components/theming/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { REPO_URL } from "@/consts/ide-constants";
import { IDE_DROPDOWN_CONTENT_CLASS } from "@/lib/ide-dropdown";
import { cn } from "@/lib/utils";
import { updateLocale } from "@/modules/i18n/lib/update-locale";

const locales = Object.keys(config.locales) as Locale[];

export function SettingsMenu() {
  const t = useTranslations("ide");
  const tLocale = useTranslations("localeSwitcher");
  const locale = useLocale() as Locale;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("settings")}
        className="flex size-10 cursor-pointer items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary"
        title={t("settings")}
      >
        <Settings className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn(IDE_DROPDOWN_CONTENT_CLASS, "w-36")}
        side="right"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("appearance")}</DropdownMenuLabel>
          <div className="flex items-center justify-between gap-2 px-2 py-1">
            <ThemeToggle className="text-xs" />
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            <Palette className="size-3.5" />
            {t("themePreset")}
          </DropdownMenuLabel>
          <div className="px-2 py-1">
            <ThemeSelector />
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            <Languages className="size-3.5" />
            {tLocale("selectLanguage")}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            onValueChange={(value) => updateLocale(value as Locale)}
            value={locale}
          >
            {locales.map((loc) => (
              <DropdownMenuRadioItem key={loc} value={loc}>
                <span className="flex items-center gap-2">
                  <span>{localeToFlagEmoji(loc)}</span>
                  <span>{config.locales[loc].label}</span>
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <a
          className="flex cursor-pointer items-center gap-1.5 px-2 py-1 text-xs outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground [&_svg]:size-3.5 [&_svg]:shrink-0"
          href={REPO_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          <ExternalLink />
          {t("viewOnGitHub")}
        </a>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
