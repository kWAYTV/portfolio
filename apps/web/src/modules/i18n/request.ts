import { getMessagesForLocale } from "@repo/i18n";
import { cacheLife } from "next/cache";
import { getRequestConfig } from "next-intl/server";
import { routing } from "@/modules/i18n/routing";

async function getCachedMessages(locale: string) {
  "use cache";
  cacheLife("max");
  return await getMessagesForLocale(locale);
}

/** Cookie fallback removed to enable static prerendering. Locale always comes from [locale] segment. */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && routing.locales.includes(requested)
      ? requested
      : routing.defaultLocale;

  return {
    locale,
    messages: await getCachedMessages(locale),
  };
});
