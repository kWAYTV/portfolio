"use client";

import {
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * `pending` is the server state (cells unrendered, with a no-JS unlock),
 * `armed` means hydrated and waiting for the grid to scroll in, `in` runs the
 * sweep and `undefined` shows everything plainly (reduced motion).
 */
type Reveal = "armed" | "in" | "pending" | undefined;

/**
 * The interactive shell around a server-rendered contribution grid. It owns
 * the scroll-in reveal and the hover readout; the readout simply echoes the
 * hovered cell's `aria-label`, so no day data crosses to the client.
 */
export function GraphFrame({
  children,
  gridLabel,
  legend,
  months,
  sheetStyle,
  totalLabel,
}: {
  children: ReactNode;
  gridLabel: string;
  legend: ReactNode;
  months: ReactNode;
  sheetStyle: CSSProperties;
  totalLabel: string;
}) {
  const frameRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [reveal, setReveal] = useState<Reveal>("pending");

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

    setReveal("armed");
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

  const handlePointerOver = useCallback((event: PointerEvent<HTMLElement>) => {
    setActive((event.target as HTMLElement).getAttribute("aria-label"));
  }, []);

  const handlePointerLeave = useCallback(() => {
    setActive(null);
  }, []);

  return (
    <figure className="graph" data-reveal={reveal} ref={frameRef}>
      <div className="graph-sheet" style={sheetStyle}>
        {months}
        <ol
          aria-label={gridLabel}
          className="graph-grid"
          onPointerLeave={handlePointerLeave}
          onPointerOver={handlePointerOver}
        >
          {children}
        </ol>
      </div>
      <figcaption className="graph-foot">
        <p aria-live="polite" className="graph-readout">
          {active ?? totalLabel}
        </p>
        {legend}
      </figcaption>
    </figure>
  );
}
