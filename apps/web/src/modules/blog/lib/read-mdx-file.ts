import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Read raw MDX file content for the IDE code view.
 * Path is relative to apps/web when running Next.js.
 */
export function readMdxFile(locale: string, slug: string): string | null {
  try {
    const filePath = join(
      process.cwd(),
      "content",
      "blog",
      locale,
      `${slug}.mdx`
    );
    return readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}
