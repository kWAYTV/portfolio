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
        <BlurFade delay={0} noBlur>
          <HeroHeader />
        </BlurFade>

        <BlurFade delay={0.05} noBlur>
          <HeroBio />
        </BlurFade>

        <BlurFade delay={0.1}>
          <Separator className="bg-border/50" />
        </BlurFade>

        <BlurFade delay={0.15}>
          <SocialNav />
        </BlurFade>

        <BlurFade delay={0.2}>
          <Separator className="bg-border/50" />
        </BlurFade>

        <BlurFade delay={0.25}>
          <Suspense fallback={<FeaturedProjectsSkeleton />}>
            <FeaturedProjectsLoader />
          </Suspense>
        </BlurFade>

        <BlurFade delay={0.3}>
          <HeroQuote />
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}
