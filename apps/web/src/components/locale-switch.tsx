"use client";

import { analytics } from "@repo/analytics";
import { config, type Locale } from "@repo/i18n/config";
import { useLocale, useTranslations } from "next-intl";
import { useCallback } from "react";
import { LocaleLink, useLocalePathname } from "@/modules/i18n/routing";

const locales = Object.keys(config.locales) as Locale[];

function LocaleOption({
  current,
  loc,
  pathname,
}: {
  current: Locale;
  loc: Locale;
  pathname: string;
}) {
  const isCurrent = loc === current;
  const handleClick = useCallback(() => {
    analytics.localeSwitch(current, loc);
  }, [current, loc]);

  if (isCurrent) {
    return (
      <span aria-current="true" className="control">
        {loc}
      </span>
    );
  }

  return (
    <LocaleLink
      className="control"
      // biome-ignore lint/suspicious/noExplicitAny: pathname is a validated app route
      href={pathname as any}
      hrefLang={loc}
      locale={loc}
      onClick={handleClick}
      prefetch
    >
      {loc}
    </LocaleLink>
  );
}

export function LocaleSwitch() {
  const locale = useLocale() as Locale;
  const pathname = useLocalePathname();
  const t = useTranslations("localeSwitcher");

  return (
    <nav aria-label={t("selectLanguage")} className="segment">
      {locales.map((loc) => (
        <LocaleOption
          current={locale}
          key={loc}
          loc={loc}
          pathname={pathname}
        />
      ))}
    </nav>
  );
}
