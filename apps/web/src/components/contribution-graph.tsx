"use client";

import type { ContributionDay } from "@repo/github";
import { useTranslations } from "next-intl";
import {
  type CSSProperties,
  type PointerEvent,
  useCallback,
  useMemo,
  useState,
} from "react";

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
  const [active, setActive] = useState<number | null>(null);

  const offset = days[0]?.weekday ?? 0;
  const weeks = Math.max(1, Math.ceil((days.length + offset) / WEEK));

  const months = useMemo(
    () => buildMonths(days, offset, weeks, locale),
    [days, locale, offset, weeks]
  );

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
    (day: ContributionDay) =>
      t("count", {
        count: day.count,
        date: dayFormatter.format(utcDate(day.date)),
      }),
    [dayFormatter, t]
  );

  const handlePointerOver = useCallback((event: PointerEvent<HTMLElement>) => {
    const index = (event.target as HTMLElement).dataset.i;
    setActive(index === undefined ? null : Number(index));
  }, []);

  const handlePointerLeave = useCallback(() => {
    setActive(null);
  }, []);

  const activeDay = active === null ? undefined : days[active];
  const readout = activeDay
    ? describe(activeDay)
    : t("total", { count: total });

  const sheetStyle = { "--weeks": weeks } as CSSProperties;

  return (
    <figure className="graph">
      <div className="graph-sheet" style={sheetStyle}>
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
        <ol
          aria-label={t("label")}
          className="graph-grid"
          onPointerLeave={handlePointerLeave}
          onPointerOver={handlePointerOver}
        >
          {Array.from({ length: offset }, (_, i) => (
            <li aria-hidden="true" className="cell is-empty" key={`pad-${i}`} />
          ))}
          {days.map((day, index) => (
            <li
              aria-label={describe(day)}
              className="cell"
              data-i={index}
              data-level={day.level}
              key={day.date}
            />
          ))}
        </ol>
      </div>
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
