import { config } from "@repo/i18n/config";
import { createNavigation } from "next-intl/navigation";
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

export const {
  Link: LocaleLink,
  redirect: localeRedirect,
  usePathname: useLocalePathname,
  useRouter: useLocaleRouter,
} = createNavigation(routing);
