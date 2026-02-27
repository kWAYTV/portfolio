"use client";

import { config, type Locale, localeToFlagEmoji } from "@repo/i18n/config";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
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
import { updateLocale } from "@/i18n/lib/update-locale";

const locales = Object.keys(config.locales) as Locale[];

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("localeSwitcher");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={t("selectLanguage")}
            size="icon"
            variant="outline"
          />
        }
      >
        <Languages className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("selectLanguage")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
