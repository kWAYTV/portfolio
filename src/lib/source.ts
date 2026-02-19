import { blog } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { cache } from "react";

export const blogSource = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blog, []),
});

/** Per-request cached blog page lookup (dedupes generateMetadata + page). */
export const getCachedBlogPage = cache((slug: string) =>
  blogSource.getPage([slug])
);
