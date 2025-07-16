import { type Table } from '@tanstack/react-table';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface TablePaginationProps<TData> {
  table: Table<TData>;
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 3; // Reduced for mobile

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 2) {
        // Near the beginning
        for (let i = 2; i <= 3; i++) {
          if (i <= totalPages) pages.push(i);
        }
        if (totalPages > 3) {
          pages.push('ellipsis');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 1) {
        // Near the end
        pages.push('ellipsis');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          if (i > 1) pages.push(i);
        }
      } else {
        // In the middle
        pages.push('ellipsis');
        pages.push(currentPage);
        pages.push('ellipsis');
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
    <div className='flex flex-col items-center justify-between space-y-2 py-4 sm:flex-row sm:space-y-0 sm:space-x-2'>
      {/* Results text - responsive */}
      <div className='text-muted-foreground order-2 text-sm sm:order-1'>
        <span className='hidden sm:inline'>
          Showing {startItem} to {endItem} of {totalItems} repositories
        </span>
        <span className='sm:hidden'>
          {startItem}-{endItem} of {totalItems}
        </span>
      </div>

      {/* Pagination controls */}
      <div className='order-1 sm:order-2'>
        <Pagination>
          <PaginationContent className='gap-1'>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                className={cn(
                  !table.getCanPreviousPage()
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer',
                  'h-8 px-2 text-sm'
                )}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis className='flex size-8 items-center justify-center' />
                ) : (
                  <PaginationLink
                    onClick={() => table.setPageIndex(page - 1)}
                    isActive={currentPage === page}
                    className='cursor-pointer'
                    size='sm'
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                className={cn(
                  !table.getCanNextPage()
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer',
                  'h-8 px-2 text-sm'
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
