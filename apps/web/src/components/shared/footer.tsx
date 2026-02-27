"use client";

import { Link } from "@i18n/routing";
import { analytics } from "@portfolio/analytics";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="absolute bottom-4 left-1/2 flex w-full max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-x-2 gap-y-1 px-2 text-muted-foreground/70 text-xs sm:bottom-8 sm:max-w-none sm:gap-x-4 sm:px-0">
      <Link
        aria-label="RSS feed"
        className="transition-colors hover:text-muted-foreground"
        href="/rss"
      >
        {t("rss")}
      </Link>

      <span>·</span>
      <span>perc.dev</span>
      <span>·</span>

      <a
        aria-label="by versend.io"
        className="transition-colors hover:text-muted-foreground"
        href="https://versend.io/"
        onClick={() => analytics.externalLink("https://versend.io/")}
        rel="noopener noreferrer"
        target="_blank"
      >
        {t("byVersend")}
      </a>
    </footer>
  );
}
