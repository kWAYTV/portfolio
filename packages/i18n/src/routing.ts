import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { config } from "./config";

export const routing = defineRouting({
	locales: Object.keys(config.locales) as [
		keyof typeof config.locales,
		...(keyof typeof config.locales)[],
	],
	defaultLocale: config.defaultLocale,
	localeCookie: { name: config.localeCookieName },
	localePrefix: Object.keys(config.locales).length > 1 ? "as-needed" : "never",
	localeDetection: Object.keys(config.locales).length > 1,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
	createNavigation(routing);
