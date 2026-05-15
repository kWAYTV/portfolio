import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContent } from "@/components/shared/page-content";
import { AboutBio } from "@/modules/about/components/about-bio";
import { AboutHeader } from "@/modules/about/components/about-header";
import { ExperienceTimeline } from "@/modules/about/components/experience-timeline";
import { CodeView } from "@/modules/ide/components/editor/code-view";
import { EditorContent } from "@/modules/ide/components/editor/editor-content";
import { aboutCode } from "@/modules/ide/consts/code-content";
import { getPageImageUrl } from "@/modules/og/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: `${t("title")} | Martin Vila`,
    description: t("subtitle"),
    openGraph: {
      images: [{ url: getPageImageUrl([locale, "about"]) }],
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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
