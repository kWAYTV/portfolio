import { getUserLocale } from "@i18n/lib/locale-cookie";
import { routing } from "@i18n/routing";
import { getMessagesForLocale } from "@portfolio/i18n/messages";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale) {
    locale = await getUserLocale();
  }

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await getMessagesForLocale(locale),
  };
});
