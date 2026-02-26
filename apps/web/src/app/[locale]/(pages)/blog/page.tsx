import { getTranslations, setRequestLocale } from "next-intl/server";
import { CodeView } from "@/components/ide/code-view";
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

  return <CodeView code={blogCode} lang="mdx" />;
}
