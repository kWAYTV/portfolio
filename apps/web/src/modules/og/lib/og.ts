const IMAGE_FILE = "image.png";
const LOCALES = ["en", "es"] as const;

/** Path segments for OG image URL. Append image.png for full URL. */
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

export const STATIC_PAGE_TYPES = [
  "home",
  "blog",
  "projects",
  "about",
] as const satisfies readonly PagePath["type"][];

export const LOCALE_LIST = LOCALES;

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

/** Parse route slug (e.g. ["en", "blog", "image.png"]) to PagePath. Inverse of pathToSegments. */
export function segmentsToPagePath(slug: string[]): PagePath | null {
  // biome-ignore lint/style/useAtIndex: slug.at(-1) requires es2022, project may target older
  if (slug[slug.length - 1] !== IMAGE_FILE || slug.length < 2) {
    return null;
  }

  const [locale, ...rest] = slug.slice(0, -1);
  if (!(locale && LOCALES.includes(locale as (typeof LOCALES)[number]))) {
    return null;
  }

  if (rest.length === 0) {
    return { type: "home", locale };
  }
  if (rest.length === 1 && rest[0] === "blog") {
    return { type: "blog", locale };
  }
  if (rest.length === 1 && rest[0] === "projects") {
    return { type: "projects", locale };
  }
  if (rest.length === 1 && rest[0] === "about") {
    return { type: "about", locale };
  }
  if (rest.length === 2 && rest[0] === "blog" && rest[1] !== "page") {
    return { type: "blog-post", locale, slug: rest[1] };
  }
  if (rest.length === 3 && rest[0] === "blog" && rest[1] === "page") {
    const num = Number.parseInt(rest[2], 10);
    if (Number.isFinite(num)) {
      return { type: "blog-page", locale, num };
    }
  }
  return null;
}
