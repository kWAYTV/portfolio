import "server-only";

import { getMessagesForLocale } from "@portfolio/i18n/messages";
import { cacheLife, cacheTag } from "next/cache";

export async function getCachedMessages(locale: string) {
  "use cache";
  cacheLife("days");
  cacheTag("i18n-messages", `messages-${locale}`);
  return await getMessagesForLocale(locale);
}
