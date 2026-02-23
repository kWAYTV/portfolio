"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3 pt-2 sm:gap-4">
      <button
        className="inline-flex h-7 items-center gap-1 px-2 text-muted-foreground/70 text-xs transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        <ChevronLeft className="size-3" />
        prev
      </button>
      <span className="text-muted-foreground/60 text-xs tabular-nums">
        {currentPage} / {totalPages}
      </span>
      <button
        className="inline-flex h-7 items-center gap-1 px-2 text-muted-foreground/70 text-xs transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        next
        <ChevronRight className="size-3" />
      </button>
    </div>
  );
}
