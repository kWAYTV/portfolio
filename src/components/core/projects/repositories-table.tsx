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
import { ArrowUpDown, ExternalLink, GitFork, Lock, Star } from 'lucide-react';
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
      <div className='max-w-xs space-y-1'>
        <div className='flex items-center gap-2 font-medium'>
          {row.original.private && (
            <Lock className='text-muted-foreground h-3 w-3' />
          )}
          {row.getValue('name')}
        </div>
        {row.original.description && (
          <div className='text-muted-foreground line-clamp-1 text-xs'>
            {row.original.description.length > 60
              ? `${row.original.description.substring(0, 60)}...`
              : row.original.description}
          </div>
        )}
      </div>
    )
  },
  {
    accessorKey: 'language',
    header: 'Language',
    cell: ({ row }) => {
      const language = row.getValue('language') as string;
      return language ? (
        <Badge variant='secondary' className='text-xs'>
          {language}
        </Badge>
      ) : (
        <span className='text-muted-foreground'>-</span>
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
        Stars
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div className='flex items-center space-x-1'>
        <Star className='h-3 w-3' />
        <span>{row.getValue('stargazers_count')}</span>
      </div>
    )
  },
  {
    accessorKey: 'forks_count',
    header: 'Forks',
    cell: ({ row }) => (
      <div className='flex items-center space-x-1'>
        <GitFork className='h-3 w-3' />
        <span>{row.getValue('forks_count')}</span>
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
      <span className='text-muted-foreground text-sm'>
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
      <div className='flex items-center space-x-2'>
        <Input
          placeholder='Filter repositories...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
      </div>

      <div className='rounded-md border'>
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
