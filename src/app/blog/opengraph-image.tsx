import { ImageResponse } from "next/og";
import { OgImageContent, ogImageSize } from "@/components/shared/og-image";
import { siteName } from "@/lib/metadata";

export const alt = `Blog | ${siteName}`;
export const size = ogImageSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgImageContent title="Blog" />, { ...size });
}
