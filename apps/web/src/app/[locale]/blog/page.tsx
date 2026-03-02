import type { Metadata } from "next";
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
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: `${t("title")} | Martin Vila`,
    openGraph: {
      images: [{ url: getPageImageUrl([locale, "blog"]) }],
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { posts, totalPages, totalCount } = getPaginatedPosts(locale, 1);
  const t = await getTranslations({ locale, namespace: "blog" });

  if (totalCount === 0) {
    return (
      <EditorContent
        preview={
          <PageContent>
            <BlogHeader />
            <p className="text-muted-foreground/60 text-xs sm:text-sm">
              {t("noPosts")}
            </p>
          </PageContent>
        }
        source={<CodeView code={blogCode} lang="tsx" />}
      />
    );
  }

  return (
    <EditorContent
      preview={
        <PageContent>
          <BlogHeader />
          <BlogListContent
            currentPage={1}
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
