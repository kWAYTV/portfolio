import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils";

const siteName = "Martin Vila";
const siteDescription = "welcome to my personal space.";

export const baseUrl = new URL(getBaseUrl() || "http://localhost:3000");

export type MetadataOverride = Partial<
  Pick<Metadata, "title" | "description" | "openGraph" | "twitter">
>;

export function createMetadata(override: MetadataOverride = {}): Metadata {
  const title =
    typeof override.title === "string"
      ? override.title
      : (override.title ?? siteName);
  const description =
    typeof override.description === "string"
      ? override.description
      : (override.description ?? siteDescription);

  return {
    title: override.title ?? undefined,
    description: override.description ?? undefined,
    openGraph: {
      type: "website",
      siteName,
      url: baseUrl.origin,
      title,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      ...override.openGraph,
    },
    twitter: {
      card: "summary",
      title,
      description,
      ...override.twitter,
    },
  };
}

export { siteName, siteDescription };
