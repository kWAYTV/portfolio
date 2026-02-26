"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the device supports hover (e.g. desktop with mouse).
 * Returns false for touch-only devices where HoverCard would not work.
 */
export function useCanHover(): boolean {
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setCanHover(mq.matches);
    const handler = () => setCanHover(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return canHover;
}
