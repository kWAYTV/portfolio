/** ISO 3166-1 alpha-2 country codes for flag emoji (ISO 639-1 locale → region). */
export const config = {
  locales: {
    en: { label: "English", region: "US" },
    es: { label: "Español", region: "ES" },
  } as const,
  defaultLocale: "en" as const,
  localeCookieName: "NEXT_LOCALE",
};

export type Locale = keyof typeof config.locales;

export const locales = Object.keys(config.locales) as Locale[];
export const defaultLocale = config.defaultLocale;
export const localeNames = Object.fromEntries(
  Object.entries(config.locales).map(([k, v]) => [k, v.label])
) as Record<Locale, string>;

/** Returns flag emoji for locale (ISO 3166-1 alpha-2 region). */
export function localeToFlagEmoji(locale: Locale): string {
  const region = config.locales[locale].region;
  return [...region]
    .map((c) => String.fromCodePoint(0x1_f1_e6 - 65 + c.charCodeAt(0)))
    .join("");
}
