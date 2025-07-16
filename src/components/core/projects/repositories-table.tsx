'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable
} from '@tanstack/react-table';
import {
  Archive,
  ArrowUpDown,
  ExternalLink,
  GitFork,
  Star
} from 'lucide-react';
import { useState } from 'react';

import { TablePagination } from '@/components/core/projects/table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { formatDate } from '@/lib/utils';
import type { GitHubRepository } from '@/types/github';

interface RepositoriesTableProps {
  repositories: GitHubRepository[];
}

const columns: ColumnDef<GitHubRepository>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-8 px-2'
      >
        Repository
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div className='flex min-w-0 cursor-help items-center gap-2 font-medium'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='cursor-help truncate'>
                {row.getValue('name')}
              </span>
            </TooltipTrigger>
            <TooltipContent side='right' className='max-w-xs'>
              <div className='space-y-1'>
                <div className='font-medium'>{row.original.full_name}</div>
                {row.original.description && (
                  <div className='text-muted-foreground text-sm'>
                    {row.original.description}
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className='flex flex-shrink-0 items-center gap-1'>
          {row.original.fork && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <GitFork className='text-muted-foreground h-3 w-3' />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Forked repository</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {row.original.archived && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Archive className='text-muted-foreground h-3 w-3' />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Archived repository</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    )
  },
  {
    accessorKey: 'language',
    header: 'Language',
    cell: ({ row }) => {
      const language = row.getValue('language') as string;
      return language ? (
        <Badge variant='secondary' className='text-xs whitespace-nowrap'>
          {language}
        </Badge>
      ) : (
        <Badge variant='destructive' className='text-xs whitespace-nowrap'>
          Unknown
        </Badge>
      );
    }
  },
  {
    accessorKey: 'stargazers_count',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-8 px-2'
      >
        <Star className='mr-1 h-3 w-3' />
        <span className='hidden sm:inline'>Stars</span>
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div className='flex items-center space-x-1'>
        <Star className='h-3 w-3 flex-shrink-0' />
        <span className='whitespace-nowrap'>
          {row.getValue('stargazers_count')}
        </span>
      </div>
    )
  },
  {
    accessorKey: 'forks_count',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-8 px-2'
      >
        <GitFork className='mr-1 h-3 w-3' />
        <span className='hidden sm:inline'>Forks</span>
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div className='flex items-center space-x-1'>
        <GitFork className='h-3 w-3 flex-shrink-0' />
        <span className='whitespace-nowrap'>{row.getValue('forks_count')}</span>
      </div>
    )
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-8 px-2'
      >
        Updated
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground text-sm whitespace-nowrap'>
        {formatDate(row.getValue('updated_at'))}
      </span>
    )
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Button variant='ghost' size='sm' asChild>
        <a
          href={row.original.html_url}
          target='_blank'
          rel='noopener noreferrer'
          aria-label={`Open ${row.original.name} on GitHub`}
        >
          <ExternalLink className='h-4 w-4' />
        </a>
      </Button>
    )
  }
];

export function RepositoriesTable({ repositories }: RepositoriesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'updated_at', desc: true }
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: repositories,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters
    },
    initialState: {
      pagination: {
        pageSize: 5
      }
    }
  });

  return (
    <div className='w-full space-y-4'>
      <div className='mb-4 flex items-center space-x-2'>
        <Input
          placeholder='Filter repositories...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='w-full max-w-sm'
        />
      </div>

      <div className='overflow-x-auto rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No repositories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} />
    </div>
  );
}
