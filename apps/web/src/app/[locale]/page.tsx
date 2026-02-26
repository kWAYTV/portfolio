import { Separator } from "@portfolio/ui";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { FeaturedProjectsLoader } from "@/components/home/featured-projects-loader";
import { FeaturedProjectsSkeleton } from "@/components/home/featured-projects-skeleton";
import { HeroBio } from "@/components/home/hero-bio";
import { HeroHeader } from "@/components/home/hero-header";
import { HeroQuote } from "@/components/home/hero-quote";
import { SocialNav } from "@/components/home/social-nav";
import { PageContent } from "@/components/shared/page-content";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return createMetadata({
    title: "Martin Vila",
    description: t("siteDescription"),
  });
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("common");

  return (
    <PageContent>
      <p className="text-muted-foreground text-sm">{t("welcome")}</p>
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
  );
}
