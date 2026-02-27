import { Separator } from "@portfolio/ui";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { FeaturedProjectsLoader } from "@/components/home/featured-projects-loader";
import { FeaturedProjectsSkeleton } from "@/components/home/featured-projects-skeleton";
import { HeroBio } from "@/components/home/hero-bio";
import { HeroHeader } from "@/components/home/hero-header";
import { HeroQuote } from "@/components/home/hero-quote";
import { SocialNav } from "@/components/home/social-nav";
import { CodeView } from "@/components/ide/editor/code-view";
import { EditorContent } from "@/components/ide/editor/editor-content";
import { PageContent } from "@/components/shared/page-content";
import { welcomeCode } from "@/consts/code-content";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return createMetadata({
    title: "Martin Vila",
    description: "welcome to my personal space.",
  });
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
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
