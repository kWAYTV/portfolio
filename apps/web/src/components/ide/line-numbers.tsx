"use client";

import { useEffect, useRef, useState } from "react";

interface LineNumbersProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export function LineNumbers({ containerRef }: LineNumbersProps) {
  const [count, setCount] = useState(50);
  const gutterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const update = () => {
      const lineHeight = 20;
      const lines = Math.ceil(container.scrollHeight / lineHeight);
      setCount(Math.max(lines, 50));
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  return (
    <div
      aria-hidden
      className="pointer-events-none sticky top-0 left-0 hidden w-12 shrink-0 select-none flex-col items-end pt-8 pr-3 font-mono text-[11px] text-muted-foreground leading-[20px] opacity-40 md:flex"
      ref={gutterRef}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={`ln-${i + 1}`}>{i + 1}</div>
      ))}
    </div>
  );
}
