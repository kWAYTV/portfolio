import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { siteName } from "@/lib/metadata";
import { OgImageContent, ogImageSize } from "@/lib/og-image";
import { getCachedBlogPage } from "@/lib/source";

type Props = { params: Promise<{ slug: string }> };

export const alt = `Blog post | ${siteName}`;
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image({ params }: Props) {
  const { slug } = await params;
  if (slug === "__placeholder__") {
    notFound();
  }
  const post = getCachedBlogPage(slug);
  if (!post) {
    notFound();
  }
  return new ImageResponse(<OgImageContent title={post.data.title} />, {
    ...size,
  });
}
