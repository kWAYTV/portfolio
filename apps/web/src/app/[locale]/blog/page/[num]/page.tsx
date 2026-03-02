import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogListContent } from "@/components/blog/blog-list-content";
import { CodeView } from "@/components/ide/editor/code-view";
import { EditorContent } from "@/components/ide/editor/editor-content";
import { PageContent } from "@/components/shared/page-content";
import { blogCode } from "@/consts/code-content";
import { getPaginatedPosts } from "@/lib/blog";
import { getPageImageUrl } from "@/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; num: string }>;
}): Promise<Metadata> {
  const { locale, num } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: `${t("title")} | Martin Vila`,
    openGraph: {
      images: [{ url: getPageImageUrl([locale, "blog", "page", num]) }],
    },
  };
}

export function generateStaticParams(): { locale: string; num: string }[] {
  const locales = ["en", "es"] as const;
  const params: { locale: string; num: string }[] = [];

  for (const locale of locales) {
    const { totalPages } = getPaginatedPosts(locale, 1);
    for (let page = 2; page <= totalPages; page++) {
      params.push({ locale, num: String(page) });
    }
  }

  // Cache Components requires at least one param for build-time validation
  if (params.length === 0) {
    return [{ locale: "en", num: "2" }];
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

  const { posts, totalPages, totalCount } = getPaginatedPosts(locale, page);
  if (page > totalPages) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <EditorContent
      preview={
        <PageContent>
          <BlogHeader />
          <BlogListContent
            currentPage={page}
            locale={locale}
            postCountLabel={t("postCount", { count: totalCount })}
            posts={posts}
            totalPages={totalPages}
          />
        </PageContent>
      }
      source={<CodeView code={blogCode} lang="tsx" />}
    />
  );
}
