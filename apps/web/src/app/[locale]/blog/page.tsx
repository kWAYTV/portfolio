import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContent } from "@/components/shared/page-content";
import { BlogHeader } from "@/modules/blog/components/blog-header";
import { BlogListContent } from "@/modules/blog/components/blog-list-content";
import { getPaginatedPosts } from "@/modules/blog/lib/blog";
import { CodeView } from "@/modules/ide/components/editor/code-view";
import { EditorContent } from "@/modules/ide/components/editor/editor-content";
import { blogCode } from "@/modules/ide/consts/code-content";
import { getPageImageUrl } from "@/modules/og/lib/og";

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
