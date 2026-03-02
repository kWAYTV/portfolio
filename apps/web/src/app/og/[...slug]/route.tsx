import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { OgImage } from "@/components/og/og-image";
import {
  getPageImageSegments,
  LOCALE_LIST,
  type PagePath,
  pathToSegments,
  STATIC_PAGE_TYPES,
  segmentsToPagePath,
} from "@/lib/og";
import { getStaticOgCopy } from "@/lib/og-copy";
import { getBlog } from "@/lib/source";

const SIZE = { width: 1200, height: 630 };

type StaticPageType = Exclude<PagePath["type"], "blog-post">;
const COPY_KEY: Record<
  StaticPageType,
  keyof typeof import("@/lib/og-copy").PAGE_COPY
> = {
  home: "home",
  blog: "blog",
  "blog-page": "blog",
  projects: "projects",
  about: "about",
};

// biome-ignore lint/suspicious/useAwait: async required for "use cache" directive
async function getOgImageData(slug: string[]) {
  "use cache";
  cacheTag("og-images");
  cacheLife("max");

  const pagePath = segmentsToPagePath(slug);
  if (!pagePath) {
    return null;
  }

  if (pagePath.type === "blog-post") {
    const blog = getBlog(pagePath.locale);
    const page = blog.getPage([pagePath.slug]);
    if (!page) {
      return null;
    }
    const data = page.data as { title: string; description?: string };
    return {
      title: data.title,
      description: data.description,
      subtitle: "Martin Vila",
    };
  }

  const copy = getStaticOgCopy(COPY_KEY[pagePath.type], pagePath.locale);
  return copy;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const data = await getOgImageData(slug);
  if (!data) {
    notFound();
  }

  return new ImageResponse(
    <OgImage
      description={data.description}
      subtitle={data.subtitle}
      title={data.title}
    />,
    SIZE
  );
}

const POSTS_PER_PAGE = 12;

export function generateStaticParams() {
  const params: { slug: string[] }[] = [];

  for (const locale of LOCALE_LIST) {
    for (const type of STATIC_PAGE_TYPES) {
      const p: PagePath = { type, locale };
      params.push({ slug: getPageImageSegments(pathToSegments(p)) });
    }

    const blog = getBlog(locale);
    const blogPages = blog.getPages();
    for (const page of blogPages) {
      const p: PagePath = { type: "blog-post", locale, slug: page.slugs[0] };
      params.push({ slug: getPageImageSegments(pathToSegments(p)) });
    }

    const totalPages = Math.max(
      1,
      Math.ceil(blogPages.length / POSTS_PER_PAGE)
    );
    for (let n = 2; n <= totalPages; n++) {
      const p: PagePath = { type: "blog-page", locale, num: n };
      params.push({ slug: getPageImageSegments(pathToSegments(p)) });
    }
  }

  return params;
}
