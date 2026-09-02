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
  | { type: "projects"; locale: string }
  | { type: "about"; locale: string };

export const STATIC_PAGE_TYPES = [
  "home",
  "projects",
  "about",
] as const satisfies readonly PagePath["type"][];

export const LOCALE_LIST = LOCALES;

export function pathToSegments(p: PagePath): string[] {
  switch (p.type) {
    case "home":
      return [p.locale];
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

/** Parse route slug (e.g. ["en", "about", "image.png"]) to PagePath. Inverse of pathToSegments. */
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
    return { locale, type: "home" };
  }
  if (rest.length === 1 && rest[0] === "projects") {
    return { locale, type: "projects" };
  }
  if (rest.length === 1 && rest[0] === "about") {
    return { locale, type: "about" };
  }
  return null;
}
