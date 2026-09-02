"use client";

import type { ContributionDay } from "@repo/github";
import { useTranslations } from "next-intl";
import {
  type ComponentProps,
  cloneElement,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  type Activity,
  ActivityCalendar,
  type ThemeInput,
} from "react-activity-calendar";

type RenderBlock = NonNullable<
  ComponentProps<typeof ActivityCalendar>["renderBlock"]
>;

const LEVELS = [0, 1, 2, 3, 4] as const;

const THEME: ThemeInput = {
  dark: [
    "var(--cell-0)",
    "var(--cell-1)",
    "var(--cell-2)",
    "var(--cell-3)",
    "var(--cell-4)",
  ],
  light: [
    "var(--cell-0)",
    "var(--cell-1)",
    "var(--cell-2)",
    "var(--cell-3)",
    "var(--cell-4)",
  ],
};

function utcDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

export function ContributionGraph({
  days,
  locale,
  total,
}: {
  days: ContributionDay[];
  locale: string;
  total: number;
}) {
  const t = useTranslations("graph");
  const [active, setActive] = useState<Activity | null>(null);

  const data = useMemo<Activity[]>(
    () => days.map(({ count, date, level }) => ({ count, date, level })),
    [days]
  );

  const months = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      month: "short",
      timeZone: "UTC",
    });
    return Array.from({ length: 12 }, (_, month) =>
      formatter.format(new Date(Date.UTC(2020, month, 1)))
    );
  }, [locale]);

  const dayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
        weekday: "short",
        year: "numeric",
      }),
    [locale]
  );

  const describe = useCallback(
    (day: Activity) =>
      t("count", {
        count: day.count,
        date: dayFormatter.format(utcDate(day.date)),
      }),
    [dayFormatter, t]
  );

  const renderBlock = useCallback<RenderBlock>(
    (block, activity) =>
      cloneElement(block, {
        "aria-label": describe(activity),
        onMouseEnter: () => setActive(activity),
        onMouseLeave: () => setActive(null),
      }),
    [describe]
  );

  const readout = active ? describe(active) : t("total", { count: total });

  return (
    <figure aria-label={t("label")} className="graph">
      <ActivityCalendar
        blockMargin={3}
        blockRadius={2}
        blockSize={10}
        className="graph-calendar"
        colorScheme="light"
        data={data}
        fontSize={12}
        labels={{
          legend: { less: t("less"), more: t("more") },
          months,
          totalCount: t("total", { count: total }),
        }}
        maxLevel={4}
        renderBlock={renderBlock}
        showColorLegend={false}
        showTotalCount={false}
        theme={THEME}
      />
      <figcaption className="graph-foot">
        <p aria-live="polite" className="graph-readout">
          {readout}
        </p>
        <div aria-hidden="true" className="graph-legend">
          <span>{t("less")}</span>
          {LEVELS.map((level) => (
            <i className="cell" data-level={level} key={level} />
          ))}
          <span>{t("more")}</span>
        </div>
      </figcaption>
    </figure>
  );
}
