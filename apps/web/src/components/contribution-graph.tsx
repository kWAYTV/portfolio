import type { ContributionDay } from "@repo/github";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { GraphFrame } from "@/components/graph-frame";

const WEEK = 7;
const LEVELS = [0, 1, 2, 3, 4] as const;
/** A leading partial month narrower than this only fits its label on wide columns. */
const SHORT_MONTH_SPAN = 3;

interface MonthMark {
  label: string;
  short: boolean;
  span: number;
  week: number;
}

function utcDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

/** One label per month, anchored to the column that starts it. */
function buildMonths(
  days: ContributionDay[],
  offset: number,
  weeks: number,
  locale: string
): MonthMark[] {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  });
  const starts: Array<{ label: string; week: number }> = [];
  let lastMonth = "";

  for (const [index, day] of days.entries()) {
    const month = day.date.slice(0, 7);
    if (month === lastMonth) {
      continue;
    }
    lastMonth = month;
    starts.push({
      label: formatter.format(utcDate(day.date)),
      week: Math.floor((index + offset) / WEEK),
    });
  }

  return starts.flatMap((mark, index) => {
    const end = starts[index + 1]?.week ?? weeks;
    const span = end - mark.week;
    if (span < 1) {
      return [];
    }
    return [{ ...mark, short: index === 0 && span < SHORT_MONTH_SPAN, span }];
  });
}

/**
 * Rendered on the server: a year of cells with their labels already formatted,
 * so the client neither receives the day list nor formats 365 dates on
 * hydration. `GraphFrame` adds the reveal and hover behaviour around it.
 */
export async function ContributionGraph({
  days,
  locale,
  total,
}: {
  days: ContributionDay[];
  locale: string;
  total: number;
}) {
  const t = await getTranslations({ locale, namespace: "graph" });

  const offset = days[0]?.weekday ?? 0;
  const weeks = Math.max(1, Math.ceil((days.length + offset) / WEEK));
  const months = buildMonths(days, offset, weeks, locale);

  const dayFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    weekday: "short",
    year: "numeric",
  });
  const describe = (day: ContributionDay) =>
    t("count", {
      count: day.count,
      date: dayFormatter.format(utcDate(day.date)),
    });

  return (
    <GraphFrame
      gridLabel={t("label")}
      legend={
        <div aria-hidden="true" className="graph-legend">
          <span>{t("less")}</span>
          {LEVELS.map((level) => (
            <i className="cell" data-level={level} key={level} />
          ))}
          <span>{t("more")}</span>
        </div>
      }
      months={
        <div aria-hidden="true" className="graph-months">
          {months.map((mark) => (
            <span
              data-short={mark.short || undefined}
              key={mark.week}
              style={{ gridColumn: `${mark.week + 1} / span ${mark.span}` }}
            >
              {mark.label}
            </span>
          ))}
        </div>
      }
      sheetStyle={{ "--weeks": weeks } as CSSProperties}
      totalLabel={t("total", { count: total })}
    >
      {Array.from({ length: offset }, (_, i) => (
        <li aria-hidden="true" className="cell is-empty" key={`pad-${i}`} />
      ))}
      {days.map((day, index) => (
        <li
          aria-label={describe(day)}
          className="cell"
          data-level={day.level}
          key={day.date}
          style={
            {
              "--col": Math.floor((index + offset) / WEEK),
            } as CSSProperties
          }
        />
      ))}
    </GraphFrame>
  );
}
