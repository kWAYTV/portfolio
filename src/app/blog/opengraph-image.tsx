import { ImageResponse } from "next/og";
import { siteName } from "@/lib/metadata";
import { OgImageContent, ogImageSize } from "@/lib/og-image";

export const alt = `Blog | ${siteName}`;
export const size = ogImageSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgImageContent title="Blog" />, { ...size });
}
