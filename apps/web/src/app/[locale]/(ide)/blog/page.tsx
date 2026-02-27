import { locales } from "@portfolio/i18n/config";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogHeader } from "@/components/content/blog/blog-header";
import { BlogList } from "@/components/content/blog/blog-list";
import { CodeView } from "@/components/ide/editor/code-view";
import { EditorContent } from "@/components/ide/editor/editor-content";
import { PageContent } from "@/components/shared/page-content";
import { blogCode } from "@/consts/code-content";
import { blogSource } from "@/lib/data";
import { createMetadata } from "@/lib/metadata";

function stripLocalePrefix(url: string): string {
  const prefix = locales.find((loc) => url.startsWith(`/${loc}/`));
  return prefix ? url.slice(prefix.length + 2) : url;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return createMetadata({
    title: `${t("title")} | Martin Vila`,
    description: t("subtitle"),
  });
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Blog({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = blogSource
    .getPages(locale)
    .sort((a, b) => {
      const dateA = new Date(a.data.date ?? 0).getTime();
      const dateB = new Date(b.data.date ?? 0).getTime();
      return dateB - dateA;
    })
    .map((post) => ({
      url: stripLocalePrefix(post.url),
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
    }));

  return (
    <EditorContent
      preview={
        <PageContent>
          <BlogHeader />
          <BlogList locale={locale} posts={posts} />
        </PageContent>
      }
      source={<CodeView code={blogCode} lang="mdx" />}
    />
  );
}
