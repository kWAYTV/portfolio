"use client";

import { updateLocale } from "@i18n/lib/update-locale";
import { getPathname, routing, usePathname } from "@i18n/routing";
import {
  type Locale,
  localeNames,
  localeToFlagEmoji,
} from "@portfolio/i18n/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@portfolio/ui";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isPending, setIsPending] = useState(false);

  const handleChange = async (newLocale: string) => {
    const loc = newLocale as Locale;
    if (loc === locale || isPending) return;

    setIsPending(true);
    try {
      await updateLocale(loc);
      const targetPath = getPathname({ href: pathname, locale: loc });
      window.location.assign(targetPath);
    } catch {
      setIsPending(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={t("language")}
          className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-muted-foreground/50 text-xs transition-colors duration-200 hover:text-foreground sm:text-sm"
          disabled={isPending}
          type="button"
        >
          <Languages className="size-3.5 shrink-0" />
          <span aria-hidden>{localeToFlagEmoji(locale)}</span>
          {locale.toUpperCase()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="ide-dropdown min-w-[8rem] rounded-sm border border-border bg-popover p-0.5 shadow-lg"
        sideOffset={4}
      >
        <DropdownMenuRadioGroup onValueChange={handleChange} value={locale}>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
