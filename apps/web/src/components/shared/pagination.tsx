"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleLink } from "@/modules/i18n/routing";

interface PaginationProps {
  basePath?: string;
  currentPage: number;
  totalPages: number;
}

function pageHref(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}/page/${page}`;
}

export function Pagination({
  basePath = "/blog",
  currentPage,
  totalPages,
}: PaginationProps) {
  const t = useTranslations("blog");

  if (totalPages <= 1) {
    return null;
  }

  const prevHref = currentPage > 1 ? pageHref(basePath, currentPage - 1) : null;
  const nextHref =
    currentPage < totalPages ? pageHref(basePath, currentPage + 1) : null;

  return (
    <div className="flex items-center justify-center gap-3 pt-2 sm:gap-4">
      {prevHref ? (
        <LocaleLink
          className="inline-flex h-7 items-center gap-1 px-2 text-muted-foreground/70 text-xs transition-colors hover:text-foreground"
          href={prevHref}
        >
          <ChevronLeft className="size-3" />
          {t("prev")}
        </LocaleLink>
      ) : (
        <span
          aria-disabled
          className="inline-flex h-7 cursor-not-allowed items-center gap-1 px-2 text-muted-foreground/40 text-xs"
        >
          <ChevronLeft className="size-3" />
          {t("prev")}
        </span>
      )}
      <span className="text-muted-foreground/60 text-xs tabular-nums">
        {currentPage} / {totalPages}
      </span>
      {nextHref ? (
        <LocaleLink
          className="inline-flex h-7 items-center gap-1 px-2 text-muted-foreground/70 text-xs transition-colors hover:text-foreground"
          href={nextHref}
        >
          {t("next")}
          <ChevronRight className="size-3" />
        </LocaleLink>
      ) : (
        <span
          aria-disabled
          className="inline-flex h-7 cursor-not-allowed items-center gap-1 px-2 text-muted-foreground/40 text-xs"
        >
          {t("next")}
          <ChevronRight className="size-3" />
        </span>
      )}
    </div>
  );
}
