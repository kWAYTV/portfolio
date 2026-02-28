import { config } from "@repo/i18n/config";

/**
 * Static params for Next.js generateStaticParams.
 * Use with setRequestLocale(locale) in each page for full static prerendering.
 * Equivalent to next-international's getStaticParams + setStaticParamsLocale pattern.
 */
export function getStaticParams() {
  return Object.keys(config.locales).map((locale) => ({ locale }));
}
