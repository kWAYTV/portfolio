"use client";

import { analytics } from "@repo/analytics";
import { config, type Locale } from "@repo/i18n/config";
import { useLocale } from "next-intl";
import { useCallback } from "react";
import { updateLocale } from "@/modules/i18n/lib/update-locale";
import { useLocalePathname } from "@/modules/i18n/routing";

const locales = Object.keys(config.locales) as Locale[];

function LocaleButton({
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
    if (isCurrent) {
      return;
    }
    analytics.localeSwitch(current, loc);
    updateLocale(loc, pathname);
  }, [current, isCurrent, loc, pathname]);

  return (
    <button
      aria-current={isCurrent ? "true" : undefined}
      className="control"
      disabled={isCurrent}
      onClick={handleClick}
      type="button"
    >
      {loc}
    </button>
  );
}

export function LocaleSwitch() {
  const locale = useLocale() as Locale;
  const pathname = useLocalePathname();

  return (
    <span className="control-group">
      {locales.map((loc) => (
        <LocaleButton
          current={locale}
          key={loc}
          loc={loc}
          pathname={pathname}
        />
      ))}
    </span>
  );
}
