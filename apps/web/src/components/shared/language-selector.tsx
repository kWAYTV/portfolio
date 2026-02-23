"use client";

import { updateLocale } from "@i18n/lib/update-locale";
import { routing, usePathname, useRouter } from "@i18n/routing";
import { type Locale, localeNames } from "@portfolio/i18n/config";
import { useLocale } from "next-intl";

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = async (newLocale: Locale) => {
    if (newLocale === locale) {
      return;
    }
    await updateLocale(newLocale);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1.5 text-muted-foreground/50 text-xs sm:text-sm">
      {routing.locales.map((loc, i) => (
        <span className="flex items-center gap-1.5" key={loc}>
          {i > 0 && <span className="text-muted-foreground/30">/</span>}
          <button
            className={`transition-colors hover:text-foreground ${
              loc === locale ? "text-foreground" : ""
            }`}
            onClick={() => handleChange(loc as Locale)}
            type="button"
          >
            {localeNames[loc as Locale]}
          </button>
        </span>
      ))}
    </div>
  );
}
