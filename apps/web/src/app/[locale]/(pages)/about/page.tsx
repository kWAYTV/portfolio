import { getTranslations, setRequestLocale } from "next-intl/server";
import { CodeView } from "@/components/ide/code-view";
import { aboutCode } from "@/consts/code-content";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return createMetadata({
    title: `${t("title")} | Martin Vila`,
    description: t("subtitle"),
  });
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function About({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CodeView code={aboutCode} lang="markdown" />;
}
