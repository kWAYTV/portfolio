import type { FumadocsSource } from "fumadocs-core/source";
import { loader } from "fumadocs-core/source";

export function createBlogSource<T extends FumadocsSource>({
  baseUrl,
  source,
}: {
  baseUrl: string;
  source: T;
}) {
  return loader({
    baseUrl,
    source,
  });
}
