import { createNavigation } from "next-intl/navigation";
import { routing } from "@/modules/i18n/routing";

export const {
  Link: LocaleLink,
  getPathname,
  redirect: localeRedirect,
  usePathname: useLocalePathname,
  useRouter: useLocaleRouter,
} = createNavigation(routing);
