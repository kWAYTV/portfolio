import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/modules/seo/urls";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
