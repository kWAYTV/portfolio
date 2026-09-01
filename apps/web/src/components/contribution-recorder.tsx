"use client";

import type { ContributionDay } from "@repo/github";
import {
  AnimatePresence,
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
const BAR_WIDTH = 1.3;
const HEIGHT = 100;
const PAD_TOP = 6;
const BASELINE = 1;

const SPRING = { damping: 42, stiffness: 520 };

interface Geometry {
  bars: Array<{ h: number; x: number; y: number }>;
  months: Array<{ label: string; pct: number }>;
  width: number;
}

function buildGeometry(
  days: ContributionDay[],
  max: number,
  locale: string
): Geometry {
  const width = days.length * DAY_WIDTH;
  const usable = HEIGHT - PAD_TOP;
  const bars = days.map((day, index) => {
    const ratio = max === 0 ? 0 : day.count / max;
    const h =
      day.count === 0 ? BASELINE : Math.max(BASELINE * 2, ratio * usable);
    return {
      h,
      x: index * DAY_WIDTH + (DAY_WIDTH - BAR_WIDTH) / 2,
      y: HEIGHT - h,
    };
  });

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

  return { bars, months, width };
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
    (i: number) => ((geometry.bars[i]?.y ?? HEIGHT) / HEIGHT) * 100,
    [geometry.bars]
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

  const valueText = `${dateLabel}, ${t("count", { count: day.count })}`;

  return (
    <figure className="recorder">
      <div className="recorder-head">
        <p aria-live="polite" className="recorder-readout">
          <strong>{dateLabel}</strong>
          <span className="recorder-value">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={{ opacity: 0, transform: "translateY(-6px)" }}
                initial={{ opacity: 0, transform: "translateY(6px)" }}
                key={day.count}
                transition={{ duration: 0.14, ease: [0.23, 1, 0.32, 1] }}
              >
                {t("count", { count: day.count })}
              </motion.span>
            </AnimatePresence>
          </span>
        </p>
      </div>
      <div
        aria-label={t("scrubHint")}
        aria-valuemax={last}
        aria-valuemin={0}
        aria-valuenow={index}
        aria-valuetext={valueText}
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
            y1={PAD_TOP}
            y2={PAD_TOP}
          />
          <g className="recorder-bars">
            {geometry.bars.map((bar, i) => (
              <rect
                className={i === index ? "is-active" : undefined}
                height={bar.h}
                key={days[i]?.date}
                width={BAR_WIDTH}
                x={bar.x}
                y={bar.y}
              />
            ))}
          </g>
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
