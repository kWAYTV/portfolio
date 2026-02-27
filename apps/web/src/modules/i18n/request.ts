import { getMessagesForLocale } from "@repo/i18n";
import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "@/modules/i18n/lib/locale-cookie";
import { routing } from "@/modules/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale) {
    locale = await getUserLocale();
  }

  if (!routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await getMessagesForLocale(locale),
  };
});
