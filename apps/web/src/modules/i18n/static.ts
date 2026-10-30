import { config } from "@repo/i18n/config";

/** Locales to prerender. The active locale is read from `next/root-params`. */
export function getStaticParams() {
  return Object.keys(config.locales).map((locale) => ({ locale }));
}
