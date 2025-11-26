import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
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
import { timelineItems } from "@/consts/timeline-items";

export default function About() {
  return (
    <PageWrapper>
      <PageContent>
        <header className="space-y-1.5">
          <h1 className="font-medium text-base tracking-tight sm:text-lg">
            About
          </h1>
          <p className="text-muted-foreground/60 text-xs sm:text-sm">
            A bit about me
          </p>
        </header>

        <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
          I&apos;m a software engineer with a passion for building backend & web
          applications. Currently actively seeking new opportunities.
        </p>

        <section className="pt-1">
          <Timeline activeIndex={1} variant="alternate">
            {timelineItems.map((item) => (
              <TimelineItem key={item.id}>
                <TimelineDot />
                <TimelineConnector />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTime dateTime={item.dateTime}>
                      {item.date}
                    </TimelineTime>
                    <TimelineTitle>{item.title}</TimelineTitle>
                  </TimelineHeader>
                  <TimelineDescription>{item.description}</TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </section>
      </PageContent>
    </PageWrapper>
  );
}
