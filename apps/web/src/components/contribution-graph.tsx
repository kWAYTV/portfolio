"use client";

import type { ContributionDay } from "@repo/github";
import { useTranslations } from "next-intl";
import { type PointerEvent, useCallback, useMemo, useState } from "react";

const WEEK = 7;
const LEVELS = [0, 1, 2, 3, 4] as const;

interface MonthMark {
  label: string;
  week: number;
}

function utcDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

/** One label per month change, placed on the week that starts it. */
function buildMonths(days: ContributionDay[], locale: string): MonthMark[] {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  });
  const offset = days[0]?.weekday ?? 0;
  const marks: MonthMark[] = [];
  let lastMonth = "";

  for (const [index, day] of days.entries()) {
    const week = Math.floor((index + offset) / WEEK);
    const month = day.date.slice(0, 7);
    if (month === lastMonth) {
      continue;
    }
    lastMonth = month;
    const previous = marks.at(-1);
    // A month that only owns the first partial column would collide with the next label.
    if (previous && week - previous.week < 2) {
      marks.pop();
    }
    marks.push({ label: formatter.format(utcDate(day.date)), week });
  }

  return marks;
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

  const months = useMemo(() => buildMonths(days, locale), [days, locale]);
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

  const offset = days[0]?.weekday ?? 0;
  const weeks = Math.ceil((days.length + offset) / WEEK);
  const spacers = useMemo(
    () => Array.from({ length: offset }, (_, i) => i),
    [offset]
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
    const target = event.target as HTMLElement;
    const index = target.dataset.i;
    if (index !== undefined) {
      setActive(Number(index));
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    setActive(null);
  }, []);

  const activeDay = active === null ? undefined : days[active];
  const readout = activeDay
    ? describe(activeDay)
    : t("total", { count: total });

  const columns = `repeat(${weeks}, var(--cell))`;

  return (
    <figure className="graph">
      <div className="graph-scroll" dir="rtl">
        <div className="graph-sheet" dir="ltr">
          <div
            aria-hidden="true"
            className="graph-months"
            style={{ gridTemplateColumns: columns }}
          >
            {months.map((mark) => (
              <span
                key={mark.label + mark.week}
                style={{ gridColumnStart: mark.week + 1 }}
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
            style={{ gridTemplateColumns: columns }}
          >
            {spacers.map((i) => (
              <li aria-hidden="true" className="cell is-empty" key={`s${i}`} />
            ))}
            {days.map((day, index) => (
              <li
                aria-label={describe(day)}
                className={`cell${index === active ? "is-active" : ""}`}
                data-i={index}
                data-level={day.level}
                key={day.date}
              />
            ))}
          </ol>
        </div>
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
