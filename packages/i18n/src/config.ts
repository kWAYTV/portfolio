/** ISO 3166-1 alpha-2 country codes for flag emoji (ISO 639-1 locale → region). */
export const config = {
  defaultLocale: "en" as const,
  localeCookieName: "NEXT_LOCALE",
  locales: {
    en: { label: "English", region: "US" },
    es: { label: "Español", region: "ES" },
  } as const,
};

export type Locale = keyof typeof config.locales;

export const locales = Object.keys(config.locales) as Locale[];
export const { defaultLocale } = config;
export const localeNames = Object.fromEntries(
  Object.entries(config.locales).map(([k, v]) => [k, v.label])
) as Record<Locale, string>;
