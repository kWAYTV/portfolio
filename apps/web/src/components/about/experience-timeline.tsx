import { getTranslations } from "next-intl/server";
import { experience } from "@/consts/experience";
import { ExperienceTimelineClient } from "./experience-timeline-client";

const experienceKeys = {
  "freelancing-1": "freelancing",
  "tokyo-school": "tokyoSchool",
  "insergal-sales": "insergalSales",
  "insergal-mechanic": "insergalMechanic",
} as const;

export async function ExperienceTimeline() {
  const t = await getTranslations("about");
  const tExp = await getTranslations("experience");

  const items = experience.map((item) => {
    const key = experienceKeys[item.id];
    return {
      id: item.id,
      period: item.period,
      periodLabel: tExp(`${key}.period`),
      company: tExp(`${key}.company`),
      role: tExp(`${key}.role`),
    };
  });

  return (
    <section className="space-y-4">
      <h2 className="font-medium text-xs tracking-tight sm:text-sm">
        {t("experience")}
      </h2>
      <ExperienceTimelineClient items={items} />
    </section>
  );
}
