'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

import { RepositoryCard } from '@/components/core/projects/repository-card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import type { Repository } from '@/interfaces/github';

interface ClientSearchProps {
  repos: Repository[];
}

export function ClientSearch({ repos }: ClientSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredRepos = repos.filter(
    repo =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRepos = filteredRepos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRepos.length / itemsPerPage);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const renderPaginationItems = () => {
    const items = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const sidePages = isMobile ? 0 : 1;
    const leftSide = Math.max(1, currentPage - sidePages);
    const rightSide = Math.min(totalPages, currentPage + sidePages);

    // Previous button
    items.push(
      <PaginationItem key='prev'>
        <PaginationPrevious
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          className={
            currentPage === 1
              ? 'pointer-events-none opacity-50'
              : 'cursor-pointer'
          }
        />
      </PaginationItem>
    );

    // First page
    if (leftSide > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
            className='h-8 w-8 cursor-pointer p-0 text-xs sm:h-9 sm:w-9 sm:text-sm'
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (leftSide > 2) {
        items.push(
          <PaginationItem key='ellipsis1'>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Current range
    for (let i = leftSide; i <= rightSide; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
            className='h-8 w-8 cursor-pointer p-0 text-xs sm:h-9 sm:w-9 sm:text-sm'
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page
    if (rightSide < totalPages) {
      if (rightSide < totalPages - 1) {
        items.push(
          <PaginationItem key='ellipsis2'>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
            className='h-8 w-8 cursor-pointer p-0 text-xs sm:h-9 sm:w-9 sm:text-sm'
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key='next'>
        <PaginationNext
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          className={
            currentPage === totalPages
              ? 'pointer-events-none opacity-50'
              : 'cursor-pointer'
          }
        />
      </PaginationItem>
    );

    return items;
  };

  return (
    <div className='space-y-4'>
      <div className='relative'>
        <Search className='absolute top-2.5 left-2 h-4 w-4 text-neutral-600 dark:text-neutral-400' />
        <Input
          name='search'
          value={searchTerm}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder='Search repositories...'
          className='h-9 w-full border-neutral-200 bg-transparent pl-8 text-base text-neutral-900 placeholder:text-neutral-600 md:text-sm dark:border-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-400'
        />
      </div>

      <div>
        {paginatedRepos.map((repo, index) => (
          <div key={repo.id}>
            <RepositoryCard repository={repo} />
            {index < paginatedRepos.length - 1 && (
              <Separator className='my-0.5 sm:my-1' />
            )}
          </div>
        ))}

        {paginatedRepos.length === 0 && (
          <p className='py-4 text-center text-neutral-600 dark:text-neutral-400'>
            No repositories found matching your search.
          </p>
        )}
      </div>

      {filteredRepos.length > itemsPerPage && (
        <>
          <Separator className='my-1 sm:my-2' />
          <Pagination>
            <PaginationContent className='gap-0.5 sm:gap-1'>
              {renderPaginationItems()}
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
