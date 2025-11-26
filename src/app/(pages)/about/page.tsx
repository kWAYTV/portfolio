import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Separator } from "@/components/ui/separator";
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

const timelineItems = [
  {
    id: "tokyo-school",
    dateTime: "2024-07",
    date: "July 2024 - Present",
    title: "Tokyo School",
    description: "PCAP Python, Computer Programming",
  },
  {
    id: "insergal-sales",
    dateTime: "2018-07",
    date: "July 2018 - July 2019",
    title: "Insergal",
    description: "Sales Assistant, Marketing",
  },
  {
    id: "insergal-mechanic",
    dateTime: "2018-07",
    date: "July 2018 - July 2019",
    title: "Insergal",
    description: "Automotive Mechanic, Mechanics and Repairers, General",
  },
  {
    id: "epapu-ourense",
    dateTime: "2014-09",
    date: "September 2014 - July 2019",
    title: "EPAPU Ourense",
    description:
      "Educación Secundaria Obligatoria (ESO), High School Certificate of Competence Program",
  },
];

export default function About() {
  return (
    <PageWrapper>
      <PageContent>
        <div className="space-y-1">
          <h1 className="font-medium text-base tracking-tight sm:text-lg">
            About
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">About me</p>
        </div>

        <Separator />

        <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
          I'm a software engineer with a passion for building backend & web
          applications. Currently actively seeking new opportunities.
        </p>

        <Timeline activeIndex={1}>
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
      </PageContent>
    </PageWrapper>
  );
}
