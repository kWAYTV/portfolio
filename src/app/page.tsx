import { Suspense } from "react";
import { FeaturedProjectsLoader } from "@/components/home/featured-projects-loader";
import { FeaturedProjectsSkeleton } from "@/components/home/featured-projects-skeleton";
import { HeroBio } from "@/components/home/hero-bio";
import { HeroHeader } from "@/components/home/hero-header";
import { HeroQuote } from "@/components/home/hero-quote";
import { SocialNav } from "@/components/home/social-nav";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <PageWrapper>
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
    </PageWrapper>
  );
}
