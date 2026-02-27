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
} from "@portfolio/ui";
import { getTranslations } from "next-intl/server";
import { experience } from "@/consts/experience";

const experienceKeys = {
  "freelancing-1": "freelancing",
  "tokyo-school": "tokyoSchool",
  "insergal-sales": "insergalSales",
  "insergal-mechanic": "insergalMechanic",
} as const;

interface ExperienceTimelineProps {
  locale: string;
}

export async function ExperienceTimeline({ locale }: ExperienceTimelineProps) {
  const t = await getTranslations({ locale, namespace: "about" });
  const tExp = await getTranslations({ locale, namespace: "experience" });

  return (
    <section className="space-y-3">
      <h2 className="font-medium text-xs tracking-tight sm:text-sm">
        {t("experience")}
      </h2>
      <Timeline activeIndex={0}>
        {experience.map((item) => {
          const key = experienceKeys[item.id];
          return (
            <TimelineItem key={item.id}>
              <TimelineDot />
              <TimelineConnector />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTime className="text-[10px] sm:text-xs">
                    {tExp(`${key}.period`)}
                  </TimelineTime>
                  <TimelineTitle className="font-medium text-xs sm:text-sm">
                    {tExp(`${key}.company`)}
                  </TimelineTitle>
                </TimelineHeader>
                <TimelineDescription className="text-[11px] sm:text-xs">
                  {tExp(`${key}.role`)}
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </section>
  );
}
