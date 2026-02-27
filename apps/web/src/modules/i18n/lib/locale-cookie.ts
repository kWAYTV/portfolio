import "server-only";

import type { Locale } from "@repo/i18n";
import { config } from "@repo/i18n/config";
import { cookies } from "next/headers";

export async function getUserLocale(): Promise<Locale> {
  const cookie = (await cookies()).get(config.localeCookieName);
  return (cookie?.value as Locale) ?? config.defaultLocale;
}

export async function setLocaleCookie(locale: Locale): Promise<void> {
  (await cookies()).set(config.localeCookieName, locale);
}
