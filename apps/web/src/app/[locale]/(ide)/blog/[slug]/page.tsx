import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BlogArticle } from "@/components/blog/blog-article";
import { BlogBackLink } from "@/components/blog/blog-back-link";
import { BlogPostHeader } from "@/components/blog/blog-post-header";
import { BlogPostViewTracker } from "@/components/blog/blog-post-view-tracker";
import { getMDXComponents } from "@/components/blog/mdx-components";
import { PageContent } from "@/components/shared/page-content";
import { createMetadata } from "@/lib/metadata";
import { blogSource, getCachedBlogPage } from "@/lib/source";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function BlogPost({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (slug === "__placeholder__") {
    notFound();
  }

  const post = getCachedBlogPage(slug, locale);

  if (!post) {
    notFound();
  }

  return (
    <PageContent className="max-w-lg sm:max-w-xl">
      <BlogPostViewTracker slug={slug} />
      <BlogBackLink />
      <BlogPostHeader
        author={post.data.author}
        date={post.data.date ?? ""}
        title={post.data.title}
      />
      <BlogArticle components={getMDXComponents()} MDX={post.data.body} />
    </PageContent>
  );
}

export function generateStaticParams() {
  const params = blogSource.generateParams("slug", "locale");
  return params.map((p) => ({
    locale: p.locale,
    slug: Array.isArray(p.slug) ? p.slug[0] : p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getCachedBlogPage(slug, locale);

  if (!post) {
    return {};
  }

  return createMetadata({
    title: `${post.data.title} | Martin Vila`,
    description: post.data.description ?? undefined,
    openGraph: { type: "article" },
  });
}
