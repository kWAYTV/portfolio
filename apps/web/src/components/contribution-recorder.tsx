"use client";

import type { ContributionDay } from "@repo/github";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useTranslations } from "next-intl";
import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useMemo,
  useState,
} from "react";

const DAY_WIDTH = 2;
const HEIGHT = 112;
const PAD_TOP = 10;
const PAD_BOTTOM = 3;

const SPRING = { damping: 42, stiffness: 520 };

interface Geometry {
  area: string;
  months: Array<{ label: string; pct: number }>;
  peakY: number;
  trace: string;
  width: number;
  ys: number[];
}

function buildGeometry(
  days: ContributionDay[],
  max: number,
  locale: string
): Geometry {
  const width = days.length * DAY_WIDTH;
  const usable = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const ys = days.map((day) => {
    const ratio = max === 0 ? 0 : day.count / max;
    return PAD_TOP + (1 - ratio) * usable;
  });

  const segments: string[] = [];
  for (const [index, y] of ys.entries()) {
    const x = index * DAY_WIDTH + DAY_WIDTH / 2;
    segments.push(`${index === 0 ? "M" : "L"}${x} ${y.toFixed(2)}`);
  }
  const trace = segments.join(" ");
  const lastX = (days.length - 1) * DAY_WIDTH + DAY_WIDTH / 2;
  const area = `${trace} L${lastX} ${HEIGHT} L${DAY_WIDTH / 2} ${HEIGHT} Z`;

  const formatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  });
  const months: Geometry["months"] = [];
  let lastMonth = "";
  for (const [index, day] of days.entries()) {
    const month = day.date.slice(0, 7);
    if (month === lastMonth) {
      continue;
    }
    lastMonth = month;
    if (index === 0) {
      continue;
    }
    months.push({
      label: formatter.format(new Date(`${day.date}T00:00:00Z`)),
      pct: (index / days.length) * 100,
    });
  }

  return { area, months, peakY: PAD_TOP, trace, width, ys };
}

export function ContributionRecorder({
  days,
  locale,
  max,
}: {
  days: ContributionDay[];
  locale: string;
  max: number;
}) {
  const t = useTranslations("graph");
  const reduceMotion = useReducedMotion();
  const geometry = useMemo(
    () => buildGeometry(days, max, locale),
    [days, max, locale]
  );
  const last = days.length - 1;
  const [index, setIndex] = useState(last);

  const toPct = useCallback(
    (i: number) => ((i + 0.5) / days.length) * 100,
    [days.length]
  );
  const toYPct = useCallback(
    (i: number) => ((geometry.ys[i] ?? HEIGHT) / HEIGHT) * 100,
    [geometry.ys]
  );

  const x = useSpring(toPct(last), SPRING);
  const y = useSpring(toYPct(last), SPRING);
  const stylusTransform = useMotionTemplate`translateX(${x}%)`;
  const penTop = useMotionTemplate`${y}%`;

  const move = useCallback(
    (next: number, instant: boolean) => {
      const clamped = Math.min(Math.max(next, 0), last);
      setIndex(clamped);
      if (instant || reduceMotion) {
        x.jump(toPct(clamped));
        y.jump(toYPct(clamped));
      } else {
        x.set(toPct(clamped));
        y.set(toYPct(clamped));
      }
    },
    [last, reduceMotion, toPct, toYPct, x, y]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      move(Math.floor(ratio * days.length), false);
    },
    [days.length, move]
  );

  const handlePointerLeave = useCallback(() => {
    move(last, false);
  }, [last, move]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? 7 : 1;
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          move(index - step, true);
          break;
        case "ArrowRight":
          event.preventDefault();
          move(index + step, true);
          break;
        case "Home":
          event.preventDefault();
          move(0, true);
          break;
        case "End":
          event.preventDefault();
          move(last, true);
          break;
        default:
          break;
      }
    },
    [index, last, move]
  );

  const day = days[index] ?? days[last];
  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
        weekday: "short",
        year: "numeric",
      }).format(new Date(`${day?.date ?? days[0]?.date}T00:00:00Z`)),
    [day?.date, days, locale]
  );

  if (!day) {
    return null;
  }

  return (
    <figure className="recorder">
      <div className="recorder-head">
        <span className="label">{t("stage", { days: days.length })}</span>
        <p aria-live="polite" className="recorder-readout">
          <strong>{dateLabel}</strong>
          <span>{t("count", { count: day.count })}</span>
        </p>
      </div>
      <div
        aria-label={t("scrubHint")}
        aria-valuemax={last}
        aria-valuemin={0}
        aria-valuenow={index}
        aria-valuetext={`${dateLabel}, ${t("count", { count: day.count })}`}
        className="recorder-stage"
        onKeyDown={handleKeyDown}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        role="slider"
        tabIndex={0}
      >
        <svg
          aria-hidden="true"
          preserveAspectRatio="none"
          viewBox={`0 0 ${geometry.width} ${HEIGHT}`}
        >
          {geometry.months.map((mark) => (
            <line
              className="recorder-grid"
              key={mark.label + mark.pct}
              x1={`${mark.pct}%`}
              x2={`${mark.pct}%`}
              y1={0}
              y2={HEIGHT}
            />
          ))}
          <line
            className="recorder-peak"
            x1={0}
            x2={geometry.width}
            y1={geometry.peakY}
            y2={geometry.peakY}
          />
          <path className="recorder-area" d={geometry.area} />
          <path className="recorder-trace" d={geometry.trace} pathLength={1} />
        </svg>
        <motion.div
          className="recorder-stylus"
          style={{ transform: stylusTransform }}
        >
          <motion.span className="recorder-pen" style={{ top: penTop }} />
        </motion.div>
      </div>
      <div aria-hidden="true" className="recorder-months">
        {geometry.months.map((mark) => (
          <span key={mark.label + mark.pct} style={{ left: `${mark.pct}%` }}>
            {mark.label}
          </span>
        ))}
      </div>
    </figure>
  );
}
