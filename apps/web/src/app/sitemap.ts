import { defaultLocale, locales } from "@portfolio/i18n/config";
import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/metadata";
import { blogSource } from "@/lib/source";

const staticPaths = ["", "/about", "/projects", "/blog"] as const;

function pathForLocale(path: string, locale: string): string {
  if (locale === defaultLocale) {
    return path || "/";
  }
  return `/${locale}${path || ""}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = baseUrl.origin;

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${origin}${pathForLocale(path, locale)}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  const blogParams = blogSource.generateParams("slug", "locale");
  for (const p of blogParams) {
    const locale = p.locale ?? defaultLocale;
    const slug = Array.isArray(p.slug) ? p.slug[0] : p.slug;
    if (!slug || slug === "__placeholder__") {
      continue;
    }

    const path = pathForLocale(`/blog/${slug}`, locale);
    entries.push({
      url: `${origin}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
