"use server";

import { setLocaleCookie } from "@i18n/lib/locale-cookie";
import { localeRedirect } from "@i18n/routing";
import type { Locale } from "@repo/i18n";

export async function updateLocale(locale: Locale): Promise<void> {
  await setLocaleCookie(locale);
  localeRedirect({ href: "/", locale });
}
