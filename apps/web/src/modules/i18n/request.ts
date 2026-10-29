import { getMessagesForLocale } from "@repo/i18n";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "@/modules/i18n/routing";

async function getCachedMessages(locale: string) {
  "use cache";
  cacheLife("max");
  return await getMessagesForLocale(locale);
}

/**
 * Locale comes from the `[locale]` root param. An explicit `locale` argument
 * still wins for Route Handlers and Server Actions, where `next/root-params`
 * is not available yet.
 */
export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootLocale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }

  return {
    locale,
    messages: await getCachedMessages(locale),
  };
});
