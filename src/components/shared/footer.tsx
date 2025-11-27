"use client";

import { useEffect, useState } from "react";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="-translate-x-1/2 absolute bottom-5 left-1/2 flex items-center gap-2 text-[10px] text-muted-foreground/40 sm:bottom-8 sm:text-xs">
      <span>© perc.dev {year ?? "2025"}</span>
      <span>·</span>
      <a
        className="transition-colors hover:text-muted-foreground/60"
        href="https://github.com/kWAYTV/portfolio"
        rel="noopener noreferrer"
        target="_blank"
      >
        source
      </a>
    </footer>
  );
}
