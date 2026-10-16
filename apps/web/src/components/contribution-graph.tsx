"use client";

import type { ContributionDay } from "@repo/github";
import { useTranslations } from "next-intl";
import {
  type ComponentProps,
  type CSSProperties,
  cloneElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
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
const BLOCK_MARGIN = 2;
const BLOCK_MAX = 8;
const BLOCK_MIN = 3;
const DAYS_PER_WEEK = 7;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type Reveal = "in" | "pending" | undefined;

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

function blockSizeFor(width: number, weeks: number) {
  const fitted = Math.floor((width + BLOCK_MARGIN) / weeks) - BLOCK_MARGIN;
  return Math.min(BLOCK_MAX, Math.max(BLOCK_MIN, fitted));
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
  const frameRef = useRef<HTMLElement | null>(null);
  const [blockSize, setBlockSize] = useState(BLOCK_MAX);
  const [active, setActive] = useState<Activity | null>(null);
  const [reveal, setReveal] = useState<Reveal>("pending");

  const data = useMemo<Activity[]>(
    () => days.map(({ count, date, level }) => ({ count, date, level })),
    [days]
  );
  const weeks = Math.max(1, Math.ceil(data.length / DAYS_PER_WEEK));

  // Column of each day in the calendar grid. The first week is padded to its
  // weekday, so the offset of the first date shifts every index.
  const columnByDate = useMemo(() => {
    const offset = data.length ? utcDate(data[0].date).getUTCDay() : 0;
    return new Map(
      data.map((day, index) => [
        day.date,
        Math.floor((index + offset) / DAYS_PER_WEEK),
      ])
    );
  }, [data]);

  useEffect(() => {
    const frame = frameRef.current;
    if (
      frame === null ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia(REDUCED_MOTION).matches
    ) {
      setReveal(undefined);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReveal("in");
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const frame: HTMLElement | null = frameRef.current;
    if (frame === null) {
      return;
    }

    const fit = () => {
      const next = blockSizeFor(frame.clientWidth, weeks);
      setBlockSize((current) => (current === next ? current : next));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [weeks]);

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
        style: {
          "--col": columnByDate.get(activity.date) ?? 0,
        } as CSSProperties,
      }),
    [columnByDate, describe]
  );

  const readout = active ? describe(active) : t("total", { count: total });

  return (
    <figure
      aria-label={t("label")}
      className="graph"
      data-reveal={reveal}
      ref={frameRef}
    >
      <ActivityCalendar
        blockMargin={BLOCK_MARGIN}
        blockRadius={2}
        blockSize={blockSize}
        className="graph-calendar"
        colorScheme="light"
        data={data}
        fontSize={blockSize >= 6 ? 12 : 10}
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
