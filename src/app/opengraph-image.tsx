import { ImageResponse } from "next/og";
import { OgImageContent, ogImageSize } from "@/components/shared/og-image";
import { siteDescription, siteName } from "@/lib/metadata";

export const alt = siteName;
export const size = ogImageSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgImageContent subtitle={siteDescription} title={siteName} />,
    { ...size }
  );
}
