"use client";

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

interface ExperienceItem {
  company: string;
  id: string;
  period: string;
  periodLabel: string;
  role: string;
}

interface ExperienceTimelineClientProps {
  items: ExperienceItem[];
}

export function ExperienceTimelineClient({
  items,
}: ExperienceTimelineClientProps) {
  const activeIndex = items.findIndex((item) =>
    item.period.toLowerCase().includes("present")
  );

  return (
    <Timeline
      activeIndex={activeIndex >= 0 ? activeIndex : undefined}
      className="[--timeline-connector-thickness:1px] [--timeline-dot-size:0.875rem]"
    >
      {items.map((item) => (
        <TimelineItem key={item.id}>
          <TimelineDot />
          <TimelineConnector />
          <TimelineContent>
            <TimelineHeader className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
              <TimelineTime
                className="text-[10px] text-muted-foreground/70 tabular-nums sm:text-xs"
                dateTime={item.period}
              >
                {item.periodLabel}
              </TimelineTime>
              <TimelineTitle className="font-medium text-foreground text-xs sm:text-sm">
                {item.company}
              </TimelineTitle>
            </TimelineHeader>
            <TimelineDescription className="text-[11px] text-muted-foreground/80 leading-relaxed sm:text-xs">
              {item.role}
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
