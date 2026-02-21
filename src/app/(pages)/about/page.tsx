import { AboutBio } from "@/components/about/about-bio";
import { AboutHeader } from "@/components/about/about-header";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { BlurFade } from "@/components/ui/blur-fade";

export default function About() {
  return (
    <PageWrapper>
      <PageContent>
        <BlurFade delay={0} noBlur>
          <AboutHeader />
        </BlurFade>

        <BlurFade delay={0.1}>
          <AboutBio />
        </BlurFade>

        <BlurFade delay={0.2}>
          <ExperienceTimeline />
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}
