"use client";

import { useEffect, useState } from "react";
import { analytics } from "@/lib/analytics";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="-translate-x-1/2 absolute bottom-4 left-1/2 flex flex-wrap items-center justify-center gap-2 px-2 text-[10px] text-muted-foreground/40 sm:bottom-8 sm:px-0 sm:text-xs">
      <span>© perc.dev {year ?? "2025"}</span>
      <span>·</span>
      <a
        className="transition-colors hover:text-muted-foreground/60"
        href="https://github.com/kWAYTV/portfolio"
        onClick={() =>
          analytics.externalLink("https://github.com/kWAYTV/portfolio")
        }
        rel="noopener noreferrer"
        target="_blank"
      >
        source
      </a>
      <span>·</span>
      <span>
        sponsored by{" "}
        <a
          className="transition-colors hover:text-muted-foreground/60"
          href="https://versend.io/"
          onClick={() => analytics.externalLink("https://versend.io/")}
          rel="noopener noreferrer"
          target="_blank"
        >
          versend.io
        </a>
      </span>
    </footer>
  );
}
