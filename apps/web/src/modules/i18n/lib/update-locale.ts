"use server";

import type { Locale } from "@repo/i18n";
import { setLocaleCookie } from "@/modules/i18n/lib/locale-cookie";
import { localeRedirect } from "@/modules/i18n/routing";

export async function updateLocale(locale: Locale): Promise<void> {
  await setLocaleCookie(locale);
  localeRedirect({ href: "/", locale });
}
