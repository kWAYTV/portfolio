import { ImageResponse } from "next/og";
import { siteName } from "@/lib/metadata";
import { getCachedBlogPage } from "@/lib/source";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getCachedBlogPage(slug, locale);

  if (!post) {
    return new ImageResponse(
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #171717 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 48, color: "white" }}>{siteName}</span>
      </div>,
      size
    );
  }

  const title = post.data.title ?? "Blog";
  const description =
    (post.data.description as string | undefined) ??
    post.data.author ??
    siteName;

  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #171717 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 48,
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: "white",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            display: "flex",
            maxWidth: 1100,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.65)",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          {description.length > 120
            ? `${description.slice(0, 117)}...`
            : description}
        </div>
      </div>
      <div
        style={{
          fontSize: 20,
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {siteName}
      </div>
    </div>,
    size
  );
}
