export const config = {
	locales: {
		en: { label: "English", currency: "USD" },
		es: { label: "Español", currency: "USD" },
	} as const,
	defaultLocale: "en" as const,
	defaultCurrency: "USD" as const,
	localeCookieName: "NEXT_LOCALE",
};

export type Locale = keyof typeof config.locales;

export const locales = Object.keys(config.locales) as Locale[];
export const defaultLocale = config.defaultLocale;
export const localeNames = Object.fromEntries(
	Object.entries(config.locales).map(([k, v]) => [k, v.label]),
) as Record<Locale, string>;
