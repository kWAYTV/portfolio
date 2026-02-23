"use client";

import { updateLocale } from "@i18n/lib/update-locale";
import { routing, usePathname, useRouter } from "@i18n/routing";
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
import { useLocale, useTranslations } from "next-intl";

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = async (newLocale: string) => {
    const loc = newLocale as Locale;
    if (loc === locale) {
      return;
    }
    await updateLocale(loc);
    router.replace(pathname, { locale: loc });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Select language"
          className="whitespace-nowrap text-muted-foreground/60 text-xs hover:text-foreground sm:text-sm"
          type="button"
        >
          {t("language")}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]" sideOffset={4}>
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
