import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { BlurFade } from "@/components/ui/blur-fade";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/components/ui/timeline";

const experience = [
  {
    id: "tokyo-school",
    period: "2024 - Present",
    role: "PCAP Python, Computer Programming",
    company: "Tokyo School",
  },
  {
    id: "insergal-sales",
    period: "2018 - 2019",
    role: "Sales Assistant, Marketing",
    company: "Insergal",
  },
  {
    id: "insergal-mechanic",
    period: "2018 - 2019",
    role: "Automotive Mechanic",
    company: "Insergal",
  },
  {
    id: "epapu",
    period: "2014 - 2019",
    role: "High School Certificate",
    company: "EPAPU Ourense",
  },
];

export default function About() {
  return (
    <PageWrapper>
      <PageContent>
        <BlurFade delay={0}>
          <header className="space-y-1.5">
            <h1 className="font-medium text-base tracking-tight sm:text-lg">
              About
            </h1>
            <p className="text-muted-foreground/60 text-xs sm:text-sm">
              A bit about me
            </p>
          </header>
        </BlurFade>

        <BlurFade delay={0.1}>
          <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
            I&apos;m a software engineer with a passion for building backend &
            web applications. Currently actively seeking new opportunities.
          </p>
        </BlurFade>

        <BlurFade delay={0.2}>
          <section className="space-y-3">
            <h2 className="font-medium text-xs tracking-tight sm:text-sm">
              Experience
            </h2>
            <Timeline activeIndex={0}>
              {experience.map((item) => (
                <TimelineItem key={item.id}>
                  <TimelineDot />
                  <TimelineConnector />
                  <TimelineContent>
                    <TimelineHeader>
                      <TimelineTime className="text-[10px] sm:text-xs">
                        {item.period}
                      </TimelineTime>
                      <TimelineTitle className="font-medium text-xs sm:text-sm">
                        {item.company}
                      </TimelineTitle>
                    </TimelineHeader>
                    <TimelineDescription className="text-[11px] sm:text-xs">
                      {item.role}
                    </TimelineDescription>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </section>
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}
