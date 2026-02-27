import "server-only";

import type { Locale } from "@portfolio/i18n/config";
import { config } from "@portfolio/i18n/config";
import { cookies } from "next/headers";

export async function getUserLocale(): Promise<Locale> {
  const cookie = (await cookies()).get(config.localeCookieName);
  const v = cookie?.value as Locale | undefined;
  return Object.keys(config.locales).includes(v ?? "")
    ? (v as Locale)
    : config.defaultLocale;
}

export async function setLocaleCookie(locale: Locale): Promise<void> {
  (await cookies()).set(config.localeCookieName, locale);
}
