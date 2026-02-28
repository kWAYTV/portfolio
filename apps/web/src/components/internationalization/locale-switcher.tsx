"use client";

import { config, type Locale, localeToFlagEmoji } from "@repo/i18n/config";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IDE_DROPDOWN_CONTENT_CLASS } from "@/lib/ide-dropdown";
import { cn } from "@/lib/utils";
import { updateLocale } from "@/modules/i18n/lib/update-locale";
import { useLocalePathname } from "@/modules/i18n/routing";

const locales = Object.keys(config.locales) as Locale[];

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = useLocalePathname();
  const t = useTranslations("localeSwitcher");

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger
            aria-label={t("selectLanguage")}
            className="flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-muted-foreground/50 text-xs transition-colors duration-200 hover:text-foreground sm:text-sm [&_svg]:size-3.5"
          >
            <Languages className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">
              {config.locales[locale].label}
            </span>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("selectLanguage")}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        align="end"
        className={cn(IDE_DROPDOWN_CONTENT_CLASS, "w-32")}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("selectLanguage")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            onValueChange={(value) => updateLocale(value as Locale, pathname)}
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
