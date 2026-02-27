import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogListLoader } from "@/components/blog/blog-list-loader";
import { CodeView } from "@/components/ide/editor/code-view";
import { EditorContent } from "@/components/ide/editor/editor-content";
import { PageContent } from "@/components/shared/page-content";
import { blogCode } from "@/consts/code-content";
import { createMetadata } from "@/lib/metadata";

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

  return (
    <EditorContent
      preview={
        <PageContent>
          <BlogHeader />
          <BlogListLoader locale={locale} />
        </PageContent>
      }
      source={<CodeView code={blogCode} lang="mdx" />}
    />
  );
}
