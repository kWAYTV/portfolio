import { config } from "@repo/i18n/config";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: config.defaultLocale,
  localeCookie: {
    name: config.localeCookieName,
  },
  localeDetection: false,
  localePrefix: "as-needed",
  locales: Object.keys(config.locales) as string[],
});
