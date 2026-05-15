"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProjectListPaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

export function ProjectListPagination({
  currentPage,
  onPageChange,
  totalPages,
}: ProjectListPaginationProps) {
  const t = useTranslations("projects");

  return (
    <div className="sticky bottom-0 z-10 -mx-2 flex shrink-0 items-center justify-center gap-3 border-border/50 border-t bg-background/95 px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] backdrop-blur-[2px] sm:-mx-3 sm:gap-4 sm:px-6 dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
      <button
        className="inline-flex h-9 min-w-18 touch-manipulation items-center justify-center gap-1 px-3 text-muted-foreground/70 text-xs transition-colors hover:text-foreground hover:underline hover:decoration-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        <ChevronLeft className="size-3.5" />
        {t("prev")}
      </button>
      <span className="min-w-12 text-center text-muted-foreground/60 text-xs tabular-nums">
        {currentPage} / {totalPages}
      </span>
      <button
        className="inline-flex h-9 min-w-18 touch-manipulation items-center justify-center gap-1 px-3 text-muted-foreground/70 text-xs transition-colors hover:text-foreground hover:underline hover:decoration-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        {t("next")}
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  );
}
