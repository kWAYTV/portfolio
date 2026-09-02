import type { MetadataRoute } from "next";
import { routing } from "@/modules/i18n/routing";
import { getAbsoluteUrl, getLanguageAlternates } from "@/modules/seo/urls";

const STATIC_ROUTES = ["/", "/about", "/projects", "/privacy"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((href) => ({
    alternates: {
      languages: getLanguageAlternates(href),
    },
    url: getAbsoluteUrl(href, routing.defaultLocale),
  }));
}
