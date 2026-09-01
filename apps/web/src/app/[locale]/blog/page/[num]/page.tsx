import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogIndex } from "@/app/[locale]/blog/page";
import { getPaginatedPosts } from "@/modules/blog/lib/blog";
import { getPageImageUrl } from "@/modules/og/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; num: string }>;
}): Promise<Metadata> {
  const { locale, num } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    openGraph: {
      images: [{ url: getPageImageUrl([locale, "blog", "page", num]) }],
    },
    title: `${t("title")} | Martin Vila`,
  };
}

export function generateStaticParams(): { locale: string; num: string }[] {
  const locales = ["en", "es"] as const;
  const params: { locale: string; num: string }[] = [];

  for (const locale of locales) {
    const { totalPages } = getPaginatedPosts(locale, 1);
    params.push(
      ...Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
        locale,
        num: String(index + 2),
      }))
    );
  }

  if (params.length === 0) {
    return [
      { locale: "en", num: "2" },
      { locale: "es", num: "2" },
    ];
  }
  return params;
}

export default async function BlogPageNum({
  params,
}: {
  params: Promise<{ locale: string; num: string }>;
}) {
  const { locale, num } = await params;
  setRequestLocale(locale);

  const page = Math.max(1, Number.parseInt(num, 10) || 1);
  if (page === 1) {
    notFound();
  }

  const { totalPages } = getPaginatedPosts(locale, page);
  if (page > totalPages) {
    notFound();
  }

  return <BlogIndex locale={locale} page={page} />;
}
