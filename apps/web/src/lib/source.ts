import { blog } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { cache } from "react";
import { fumadocsI18n } from "@/lib/i18n";

export const blogSource = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blog, []),
  i18n: fumadocsI18n,
});

/** Per-request cached blog page lookup (dedupes generateMetadata + page). */
export const getCachedBlogPage = cache((slug: string, locale: string) =>
  blogSource.getPage([slug], locale)
);
