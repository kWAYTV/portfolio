import { AboutBio } from "@/components/about/about-bio";
import { AboutHeader } from "@/components/about/about-header";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";

export default function About() {
  return (
    <PageWrapper>
      <PageContent>
        <AboutHeader />
        <AboutBio />
        <ExperienceTimeline />
      </PageContent>
    </PageWrapper>
  );
}
