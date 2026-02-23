import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils";

const siteName = "Martin Vila";
const siteDescription = "welcome to my personal space.";
const twitterHandle = "@ogeperc";

export const baseUrl = new URL(getBaseUrl() || "http://localhost:3000");

const ogImageDimensions = { width: 1200, height: 630, alt: siteName } as const;

function getOgImageUrl(imagePath?: string) {
  return `${baseUrl.origin}${imagePath ?? "/opengraph-image"}`;
}

export type MetadataOverride = Partial<
  Pick<Metadata, "title" | "description" | "openGraph" | "twitter">
> & { imagePath?: string };

export function createMetadata(override: MetadataOverride = {}): Metadata {
  const title =
    typeof override.title === "string"
      ? override.title
      : (override.title ?? siteName);
  const description =
    typeof override.description === "string"
      ? override.description
      : (override.description ?? siteDescription);

  const images = {
    ...ogImageDimensions,
    url: getOgImageUrl(override.imagePath),
  };

  return {
    title: override.title ?? undefined,
    description: override.description ?? undefined,
    openGraph: {
      type: "website",
      siteName,
      url: baseUrl.origin,
      title,
      description,
      images,
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: twitterHandle,
      title,
      description,
      images: images.url,
      ...override.twitter,
    },
  };
}

export { siteName, siteDescription, twitterHandle };
