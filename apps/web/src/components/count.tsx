"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** Counts up once when scrolled into view. Server renders the final value. */
export function Count({
  className,
  locale,
  value,
}: {
  className?: string;
  locale: string;
  value: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.6, once: true });
  const reduceMotion = useReducedMotion();
  const formatter = new Intl.NumberFormat(locale);

  useEffect(() => {
    const node = ref.current;
    if (!(inView && node) || reduceMotion || value === 0) {
      return;
    }
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (latest) => {
        node.textContent = formatter.format(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, formatter]);

  return (
    <span className={className} ref={ref}>
      {formatter.format(value)}
    </span>
  );
}
