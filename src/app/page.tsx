import { Suspense } from "react";
import { FeaturedProjectsLoader } from "@/components/home/featured-projects-loader";
import { FeaturedProjectsSkeleton } from "@/components/home/featured-projects-skeleton";
import { HeroBio } from "@/components/home/hero-bio";
import { HeroHeader } from "@/components/home/hero-header";
import { HeroQuote } from "@/components/home/hero-quote";
import { SocialNav } from "@/components/home/social-nav";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { BlurFade } from "@/components/ui/blur-fade";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <PageWrapper>
      <PageContent>
        <BlurFade delay={0}>
          <HeroHeader />
        </BlurFade>

        <BlurFade delay={0.1}>
          <HeroBio />
        </BlurFade>

        <BlurFade delay={0.15}>
          <Separator className="bg-border/50" />
        </BlurFade>

        <BlurFade delay={0.2}>
          <SocialNav />
        </BlurFade>

        <BlurFade delay={0.25}>
          <Separator className="bg-border/50" />
        </BlurFade>

        <BlurFade delay={0.3}>
          <Suspense fallback={<FeaturedProjectsSkeleton />}>
            <FeaturedProjectsLoader />
          </Suspense>
        </BlurFade>

        <BlurFade delay={0.4}>
          <HeroQuote />
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}
