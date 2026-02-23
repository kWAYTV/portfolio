import { setRequestLocale } from "next-intl/server";
import { AboutBio } from "@/components/about/about-bio";
import { AboutHeader } from "@/components/about/about-header";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About | Martin Vila",
  description: "A bit about me",
});

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function About({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

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
