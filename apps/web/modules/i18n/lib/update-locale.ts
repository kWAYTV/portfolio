"use server";

import { setLocaleCookie } from "@i18n/lib/locale-cookie";
import type { Locale } from "@portfolio/i18n";
import { revalidatePath } from "next/cache";

export async function updateLocale(locale: Locale): Promise<void> {
  await setLocaleCookie(locale);
  revalidatePath("/");
}
