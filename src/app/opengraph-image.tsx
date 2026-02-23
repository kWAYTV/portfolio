import { ImageResponse } from "next/og";
import { siteDescription, siteName } from "@/lib/metadata";
import { OgImageContent, ogImageSize } from "@/lib/og-image";

export const alt = siteName;
export const size = ogImageSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgImageContent subtitle={siteDescription} title={siteName} />,
    { ...size }
  );
}
