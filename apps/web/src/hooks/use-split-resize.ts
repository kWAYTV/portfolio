"use client";

import { useCallback, useRef, useState } from "react";

interface UseSplitResizeOptions {
  setSplitRatio: (ratio: number) => void;
}

export function useSplitResize({ setSplitRatio }: UseSplitResizeOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredDividerIndex, setHoveredDividerIndex] = useState<number | null>(
    null
  );
  const [draggingDividerIndex, setDraggingDividerIndex] = useState<
    number | null
  >(null);

  const handlePointerDown = useCallback(
    (_dividerIndex: number) => (e: React.PointerEvent) => {
      e.preventDefault();
      setDraggingDividerIndex(_dividerIndex);
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onPointerMove = (moveEvent: PointerEvent) => {
        const el = containerRef.current;
        if (!el) {
          return;
        }
        const rect = el.getBoundingClientRect();
        const ratio = (moveEvent.clientX - rect.left) / rect.width;
        setSplitRatio(Math.max(0.2, Math.min(0.8, ratio)));
      };

      const onPointerUp = () => {
        setDraggingDividerIndex(null);
        target.releasePointerCapture(e.pointerId);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        target.removeEventListener("pointermove", onPointerMove);
        target.removeEventListener("pointerup", onPointerUp);
      };

      target.addEventListener("pointermove", onPointerMove);
      target.addEventListener("pointerup", onPointerUp);
    },
    [setSplitRatio]
  );

  return {
    containerRef,
    draggingDividerIndex,
    handlePointerDown,
    hoveredDividerIndex,
    setHoveredDividerIndex,
  };
}
