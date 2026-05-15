import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { PageContent } from "@/components/shared/page-content";
import { Separator } from "@/components/ui/separator";
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
          <HeroHeader />
          <HeroBio />
          <Separator className="bg-border/50" />
          <SocialNav />
          <Separator className="bg-border/50" />
          <Suspense fallback={<FeaturedProjectsSkeleton />}>
            <FeaturedProjectsLoader />
          </Suspense>
          <HeroQuote />
        </PageContent>
      }
      source={<CodeView code={welcomeCode} lang="tsx" />}
    />
  );
}
