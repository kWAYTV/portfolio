import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/blog-article";
import { BlogBackLink } from "@/components/blog/blog-back-link";
import { BlogPostHeader } from "@/components/blog/blog-post-header";
import { getMDXComponents } from "@/components/mdx/mdx-components";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { BlurFade } from "@/components/ui/blur-fade";
import { blogSource } from "@/lib/source";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  // Workaround for Cache Components: generateStaticParams must return at least
  // one param for build validation, so we return a placeholder when no posts exist
  if (slug === "__placeholder__") {
    notFound();
  }

  const post = blogSource.getPage([slug]);

  if (!post) {
    notFound();
  }

  return (
    <PageWrapper>
      <PageContent className="max-w-lg sm:max-w-xl">
        <BlurFade delay={0}>
          <BlogBackLink />
        </BlurFade>

        <BlurFade delay={0.1}>
          <BlogPostHeader
            author={post.data.author}
            date={post.data.date ?? ""}
            title={post.data.title}
          />
        </BlurFade>

        <BlurFade delay={0.2}>
          <BlogArticle components={getMDXComponents()} MDX={post.data.body} />
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}

export async function generateStaticParams() {
  const pages = blogSource.getPages();

  if (pages.length === 0) {
    return [{ slug: "__placeholder__" }];
  }

  return pages.map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogSource.getPage([slug]);

  if (!post) {
    return {};
  }

  return {
    title: `${post.data.title} | Martin Vila`,
    description: post.data.description,
  };
}
