import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogHeader } from "@/components/blog/blog-header";
import { CodeView } from "@/components/ide/editor/code-view";
import { EditorContent } from "@/components/ide/editor/editor-content";
import { PageContent } from "@/components/shared/page-content";
import { Pagination } from "@/components/shared/pagination";
import { blogCode } from "@/consts/code-content";
import { getPageImageUrl } from "@/lib/og";
import { getBlog } from "@/lib/source";

const POSTS_PER_PAGE = 12;

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

  const blog = getBlog(locale);
  const allPosts = blog.getPages().sort((a, b) => {
    const dateA = new Date((a.data as { date?: string }).date ?? 0).getTime();
    const dateB = new Date((b.data as { date?: string }).date ?? 0).getTime();
    return dateB - dateA;
  });

  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const start = 0;
  const posts = allPosts.slice(start, start + POSTS_PER_PAGE);
  const t = await getTranslations({ locale, namespace: "blog" });

  if (allPosts.length === 0) {
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
          <p className="text-[11px] text-muted-foreground/60">
            {t("postCount", { count: allPosts.length })}
          </p>
          <div className="space-y-1">
            {posts.map((post) => {
              const data = post.data as unknown as {
                title: string;
                description?: string;
                author: string;
                date: string;
              };
              return (
                <BlogCard
                  date={data.date}
                  description={data.description}
                  key={post.url}
                  locale={locale}
                  title={data.title}
                  url={post.url}
                />
              );
            })}
          </div>
          <Pagination
            basePath="/blog"
            currentPage={1}
            totalPages={totalPages}
          />
        </PageContent>
      }
      source={<CodeView code={blogCode} lang="tsx" />}
    />
  );
}
