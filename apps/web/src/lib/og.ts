export const IMAGE_FILE = "image.webp";

/** Path segments for OG image URL. Append image.webp for full URL. */
export function getPageImageSegments(path: string[]): string[] {
  return [...path, IMAGE_FILE];
}

/** Full URL for an OG image (used in metadata.openGraph.images) */
export function getPageImageUrl(path: string[]): string {
  return `/og/${getPageImageSegments(path).join("/")}`;
}

/** Page types and their path structure */
export type PagePath =
  | { type: "home"; locale: string }
  | { type: "blog"; locale: string }
  | { type: "blog-page"; locale: string; num: number }
  | { type: "blog-post"; locale: string; slug: string }
  | { type: "projects"; locale: string }
  | { type: "about"; locale: string };

export function pathToSegments(p: PagePath): string[] {
  switch (p.type) {
    case "home":
      return [p.locale];
    case "blog":
      return [p.locale, "blog"];
    case "blog-page":
      return [p.locale, "blog", "page", String(p.num)];
    case "blog-post":
      return [p.locale, "blog", p.slug];
    case "projects":
      return [p.locale, "projects"];
    case "about":
      return [p.locale, "about"];
    default: {
      const _: never = p;
      return _;
    }
  }
}
