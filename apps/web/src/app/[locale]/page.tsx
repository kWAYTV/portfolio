import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { PageContent } from "@/components/shared/page-content";
import { Reveal } from "@/components/shared/reveal";
import { FeaturedProjectsLoader } from "@/modules/home/components/featured-projects-loader";
import { FeaturedProjectsSkeleton } from "@/modules/home/components/featured-projects-skeleton";
import { HeroBio } from "@/modules/home/components/hero-bio";
import { HeroHeader } from "@/modules/home/components/hero-header";
import { HeroQuote } from "@/modules/home/components/hero-quote";
import { SocialNav } from "@/modules/home/components/social-nav";
import { CodeView } from "@/modules/ide/components/editor/code-view";
import { EditorContent } from "@/modules/ide/components/editor/editor-content";
import { welcomeCode } from "@/modules/ide/consts/code-content";
import { getPageImageUrl } from "@/modules/og/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    title: t("siteTitle"),
    description: t("siteDescription"),
    openGraph: {
      images: [{ url: getPageImageUrl([locale]) }],
    },
  };
}

export default async function HomePage({
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
          <Reveal index={0}>
            <HeroHeader />
          </Reveal>
          <Reveal index={1}>
            <HeroBio />
          </Reveal>
          <Reveal index={2}>
            <SocialNav />
          </Reveal>
          <Reveal index={3}>
            <Suspense fallback={<FeaturedProjectsSkeleton />}>
              <FeaturedProjectsLoader />
            </Suspense>
          </Reveal>
          <Reveal index={4}>
            <HeroQuote />
          </Reveal>
        </PageContent>
      }
      source={<CodeView code={welcomeCode} lang="tsx" />}
    />
  );
}
