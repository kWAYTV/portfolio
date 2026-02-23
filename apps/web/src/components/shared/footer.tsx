"use client";

import { analytics } from "@portfolio/analytics";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-x-3 gap-y-1 px-2 text-muted-foreground/50 text-xs sm:bottom-8 sm:gap-x-4 sm:px-0">
      <Link
        className="transition-colors hover:text-muted-foreground"
        href="/rss"
      >
        rss
      </Link>

      <span>·</span>
      <span>perc.dev</span>
      <span>·</span>

      <a
        className="transition-colors hover:text-muted-foreground"
        href="https://versend.io/"
        onClick={() => analytics.externalLink("https://versend.io/")}
        rel="noopener noreferrer"
        target="_blank"
      >
        by versend.io
      </a>
    </footer>
  );
}
