import defaultMdxComponents from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BlogBackLink } from "@/components/blog/blog-back-link";
import { BlogPostHeader } from "@/components/blog/blog-post-header";
import { CodeView } from "@/components/ide/editor/code-view";
import { EditorContent } from "@/components/ide/editor/editor-content";
import { PageContent } from "@/components/shared/page-content";
import { readMdxFile } from "@/lib/read-mdx-file";
import { getBlog } from "@/lib/source";

// biome-ignore lint/style/useConsistentTypeDefinitions: fumadocs
type BlogPageData = {
  body: React.ComponentType<{
    components?: Record<string, React.ComponentType>;
  }>;
  title: string;
  description?: string;
  author: string;
  date: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const blog = getBlog(locale);
  const page = blog.getPage([slug]);
  if (!page) {
    return {};
  }
  return {
    title: `${page.data.title} | Martin Vila`,
    description: page.data.description as string,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const blog = getBlog(locale);
  const page = blog.getPage([slug]);

  if (!page) {
    notFound();
  }

  const data = page.data as unknown as BlogPageData;
  const Mdx = data.body;
  const rawMdx =
    readMdxFile(locale, slug) ??
    `---\ntitle: ${data.title}\ndescription: ${data.description ?? ""}\ndate: ${data.date}\nauthor: ${data.author}\n---\n\n(Content not found)`;

  return (
    <EditorContent
      preview={
        <PageContent className="max-w-lg sm:max-w-xl">
          <BlogBackLink />
          <BlogPostHeader
            author={data.author}
            date={data.date}
            locale={locale}
            title={data.title}
          />
          <article className="prose prose-neutral prose-sm dark:prose-invert prose-table:w-full max-w-none prose-img:max-w-full prose-pre:overflow-x-auto prose-table:overflow-x-auto prose-img:rounded-md prose-headings:font-medium prose-a:text-foreground prose-code:text-xs prose-p:text-muted-foreground/80 prose-headings:tracking-tight prose-a:underline-offset-4">
            {/* @ts-expect-error MDXContent accepts components */}
            <Mdx components={defaultMdxComponents} />
          </article>
        </PageContent>
      }
      source={<CodeView code={rawMdx} lang="mdx" />}
    />
  );
}

export function generateStaticParams(): { locale: string; slug: string }[] {
  const locales = ["en", "es"];
  const blogEn = getBlog("en");
  const blogEs = getBlog("es");
  const loaders = [blogEn, blogEs];
  const params: { locale: string; slug: string }[] = [];
  for (let i = 0; i < locales.length; i++) {
    const pages = loaders[i].getPages();
    for (const page of pages) {
      params.push({
        locale: locales[i],
        slug: page.slugs[0],
      });
    }
  }
  return params;
}
