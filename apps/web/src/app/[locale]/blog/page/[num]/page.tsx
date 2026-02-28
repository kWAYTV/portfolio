import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogHeader } from "@/components/blog/blog-header";
import { CodeView } from "@/components/ide/editor/code-view";
import { EditorContent } from "@/components/ide/editor/editor-content";
import { PageContent } from "@/components/shared/page-content";
import { Pagination } from "@/components/shared/pagination";
import { blogCode } from "@/consts/code-content";
import { getBlog } from "@/lib/source";

const POSTS_PER_PAGE = 12;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; num: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: `${t("title")} | Martin Vila`,
  };
}

export function generateStaticParams(): { locale: string; num: string }[] {
  const locales = ["en", "es"] as const;
  const params: { locale: string; num: string }[] = [];
  for (const locale of locales) {
    const blog = getBlog(locale);
    const allPosts = blog.getPages();
    const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
    for (let page = 2; page <= totalPages; page++) {
      params.push({ locale, num: String(page) });
    }
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

  const blog = getBlog(locale);
  const allPosts = blog.getPages().sort((a, b) => {
    const dateA = new Date((a.data as { date?: string }).date ?? 0).getTime();
    const dateB = new Date((b.data as { date?: string }).date ?? 0).getTime();
    return dateB - dateA;
  });

  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  if (page > totalPages) {
    notFound();
  }

  const start = (page - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(start, start + POSTS_PER_PAGE);
  const t = await getTranslations({ locale, namespace: "blog" });

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
            currentPage={page}
            totalPages={totalPages}
          />
        </PageContent>
      }
      source={<CodeView code={blogCode} lang="tsx" />}
    />
  );
}
