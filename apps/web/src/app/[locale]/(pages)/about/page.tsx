import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutBio } from "@/components/about/about-bio";
import { AboutHeader } from "@/components/about/about-header";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { CodeView } from "@/components/ide/code-view";
import { EditorContent } from "@/components/ide/editor-content";
import { PageContent } from "@/components/shared/page-content";
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

  return (
    <EditorContent
      preview={
        <PageContent>
          <AboutHeader />
          <AboutBio />
          <ExperienceTimeline />
        </PageContent>
      }
      source={<CodeView code={aboutCode} lang="markdown" />}
    />
  );
}
