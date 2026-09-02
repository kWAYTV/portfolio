import type { MetadataRoute } from "next";
import { getSortedPosts } from "@/modules/blog/lib/blog";
import { routing } from "@/modules/i18n/routing";
import { getAbsoluteUrl, getLanguageAlternates } from "@/modules/seo/urls";

const STATIC_ROUTES = [
  "/",
  "/about",
  "/projects",
  "/blog",
  "/privacy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map((href) => ({
    alternates: {
      languages: getLanguageAlternates(href),
    },
    url: getAbsoluteUrl(href, routing.defaultLocale),
  }));

  const postsByHref = new Map<
    string,
    { lastModified?: string; locales: string[] }
  >();

  for (const locale of routing.locales) {
    for (const post of getSortedPosts(locale)) {
      const current = postsByHref.get(post.url) ?? { locales: [] };
      current.locales.push(locale);
      const { date } = post.data as { date?: string };
      if (date) {
        current.lastModified = date;
      }
      postsByHref.set(post.url, current);
    }
  }

  const postEntries = [...postsByHref].map(
    ([href, { lastModified, locales }]) => {
      const canonicalLocale = locales.includes(routing.defaultLocale)
        ? routing.defaultLocale
        : locales[0];

      return {
        alternates: {
          languages: Object.fromEntries(
            locales.map((locale) => [locale, getAbsoluteUrl(href, locale)])
          ),
        },
        lastModified,
        url: getAbsoluteUrl(href, canonicalLocale),
      };
    }
  );

  return [...staticEntries, ...postEntries];
}
