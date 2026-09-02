import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { OgImage } from "@/modules/og/components/og-image";
import {
  getPageImageSegments,
  LOCALE_LIST,
  type PagePath,
  pathToSegments,
  STATIC_PAGE_TYPES,
  segmentsToPagePath,
} from "@/modules/og/lib/og";
import { getStaticOgCopy } from "@/modules/og/lib/og-copy";

const SIZE = { height: 630, width: 1200 };

// biome-ignore lint/suspicious/useAwait: async required for "use cache" directive
async function getOgImageData(slug: string[]) {
  "use cache";
  cacheTag("og-images");
  cacheLife("max");

  const pagePath = segmentsToPagePath(slug);
  if (!pagePath) {
    return null;
  }

  return getStaticOgCopy(pagePath.type, pagePath.locale);
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

export function generateStaticParams() {
  const params: { slug: string[] }[] = [];

  for (const locale of LOCALE_LIST) {
    for (const type of STATIC_PAGE_TYPES) {
      const p: PagePath = { locale, type };
      params.push({ slug: getPageImageSegments(pathToSegments(p)) });
    }
  }

  return params;
}
