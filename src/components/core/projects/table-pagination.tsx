import type { Table } from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type TablePaginationProps<TData> = {
  table: Table<TData>;
};

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  // Generate page numbers to show
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Pagination logic requires branching for edge cases
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const MAX_VISIBLE = 3; // Reduced for mobile
    const FIRST_PAGE = 1;
    const SECOND_PAGE = 2;
    const THIRD_PAGE = 3;
    const PAGE_OFFSET_NEAR_END = 2;

    if (totalPages <= MAX_VISIBLE) {
      // Show all pages if total is small
      for (let i = FIRST_PAGE; i <= totalPages; i += 1) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(FIRST_PAGE);

      if (currentPage <= SECOND_PAGE) {
        // Near the beginning
        for (let i = SECOND_PAGE; i <= THIRD_PAGE; i += 1) {
          if (i <= totalPages) {
            pages.push(i);
          }
        }
        if (totalPages > THIRD_PAGE) {
          pages.push("ellipsis");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 1) {
        // Near the end
        pages.push("ellipsis");
        for (
          let i = totalPages - PAGE_OFFSET_NEAR_END;
          i <= totalPages;
          i += 1
        ) {
          if (i > FIRST_PAGE) {
            pages.push(i);
          }
        }
      } else {
        // In the middle
        pages.push("ellipsis");
        pages.push(currentPage);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const startItem =
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
    1;
  const endItem = Math.min(
    (table.getState().pagination.pageIndex + 1) *
      table.getState().pagination.pageSize,
    table.getFilteredRowModel().rows.length
  );
  const totalItems = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col items-center justify-between space-y-2 py-4 sm:flex-row sm:space-x-2 sm:space-y-0">
      {/* Results text - responsive */}
      <div className="order-2 text-muted-foreground text-sm sm:order-1">
        <span className="hidden sm:inline">
          Showing {startItem} to {endItem} of {totalItems} repositories
        </span>
        <span className="sm:hidden">
          {startItem}-{endItem} of {totalItems}
        </span>
      </div>

      {/* Pagination controls */}
      <div className="order-1 sm:order-2">
        <Pagination>
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                className={cn(
                  table.getCanPreviousPage()
                    ? "cursor-pointer"
                    : "pointer-events-none opacity-50",
                  "h-8 px-2 text-sm"
                )}
                onClick={() => table.previousPage()}
              />
            </PaginationItem>

            {getPageNumbers().map((page) => {
              const key =
                page === "ellipsis"
                  ? `ellipsis-${String(Math.random())}`
                  : `page-${page}`;
              return (
                <PaginationItem key={key}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis className="flex size-8 items-center justify-center" />
                  ) : (
                    <PaginationLink
                      className="cursor-pointer"
                      isActive={currentPage === page}
                      onClick={() => table.setPageIndex(page - 1)}
                      size="sm"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                className={cn(
                  table.getCanNextPage()
                    ? "cursor-pointer"
                    : "pointer-events-none opacity-50",
                  "h-8 px-2 text-sm"
                )}
                onClick={() => table.nextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
