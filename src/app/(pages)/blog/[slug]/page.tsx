import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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

  // Handle placeholder for empty blog (required by Cache Components)
  if (slug === "__placeholder__") {
    notFound();
  }

  const post = blogSource.getPage([slug]);

  if (!post) {
    notFound();
  }

  const MDX = post.data.body;

  return (
    <PageWrapper>
      <PageContent className="max-w-lg sm:max-w-xl">
        <BlurFade delay={0}>
          <Link
            className="text-[10px] text-muted-foreground/50 transition-colors hover:text-muted-foreground sm:text-xs"
            href="/blog"
          >
            ← Back to blog
          </Link>
        </BlurFade>

        <BlurFade delay={0.1}>
          <header className="space-y-1.5">
            <h1 className="font-medium text-base tracking-tight sm:text-lg">
              {post.data.title}
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50 sm:text-xs">
              <span>{post.data.author}</span>
              <span>·</span>
              <time>
                {new Date(post.data.date ?? "").toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
          </header>
        </BlurFade>

        <BlurFade delay={0.2}>
          <article className="prose prose-neutral prose-sm dark:prose-invert prose-table:block prose-table:w-full max-w-none prose-img:max-w-full prose-pre:overflow-x-auto prose-table:overflow-x-auto prose-img:rounded-md prose-headings:font-medium prose-a:text-foreground prose-code:text-xs prose-p:text-muted-foreground/80 prose-headings:tracking-tight prose-a:underline-offset-4">
            <MDX components={getMDXComponents()} />
          </article>
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}

export async function generateStaticParams() {
  const pages = blogSource.getPages();

  // Cache Components requires at least one param for build validation
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
