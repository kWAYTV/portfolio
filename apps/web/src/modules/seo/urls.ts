import { env } from "@repo/env/web";
import { getPathname, routing } from "@/modules/i18n/routing";

const TRAILING_SLASH = /\/$/;

export function getSiteUrl(): string {
  return env.NEXT_PUBLIC_SITE_URL.replace(TRAILING_SLASH, "");
}

export function getAbsoluteUrl(href: string, locale: string): string {
  return `${getSiteUrl()}${getPathname({ href, locale })}`;
}

export function getLanguageAlternates(href: string): Record<string, string> {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, getAbsoluteUrl(href, locale)])
  );

  languages["x-default"] = getAbsoluteUrl(href, routing.defaultLocale);
  return languages;
}
