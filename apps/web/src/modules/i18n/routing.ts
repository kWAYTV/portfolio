import { config } from "@repo/i18n/config";
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: Object.keys(config.locales) as string[],
  defaultLocale: config.defaultLocale,
  localeCookie: {
    name: config.localeCookieName,
  },
  localePrefix: "never",
  localeDetection: false,
});

export const {
  Link: LocaleLink,
  redirect: localeRedirect,
  usePathname: useLocalePathname,
  useRouter: useLocaleRouter,
} = createNavigation(routing);
