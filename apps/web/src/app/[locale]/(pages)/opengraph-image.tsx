import { siteName } from "@/lib/metadata";
import { createDefaultOgImage, defaultOgSize } from "@/lib/opengraph-image";

export const alt = siteName;
export const size = defaultOgSize;
export const contentType = "image/png";

export default function Image() {
  return createDefaultOgImage();
}
