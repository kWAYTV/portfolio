import { blogEn, blogEs } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";

export const blogEnLoader = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blogEn, []),
});

export const blogEsLoader = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blogEs, []),
});

export function getBlog(locale: string) {
  return locale === "es" ? blogEsLoader : blogEnLoader;
}
