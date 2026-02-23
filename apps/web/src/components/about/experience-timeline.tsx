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
import { experience } from "@/consts/experience";

export function ExperienceTimeline() {
  return (
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
  );
}
