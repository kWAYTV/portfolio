'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { RepositoryCard } from '@/components/core/projects/repository-card';
import { RepositoryCardSkeleton } from '@/components/core/projects/repository-card-skeleton';
import { SearchInput } from '@/components/core/projects/search-input';
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
import { useGithubRepos } from '@/hooks/use-github-repos';

export function ClientProjects() {
  const {
    repos,
    totalRepos,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage
  } = useGithubRepos();

  const totalPages = Math.ceil(totalRepos / itemsPerPage);

  if (error) {
    return <div>Error loading repositories: {error.message}</div>;
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 3;
    const leftSide = Math.max(1, currentPage - 1);
    const rightSide = Math.min(totalPages, currentPage + 1);

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
            className='cursor-pointer'
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
            className='cursor-pointer'
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
            className='cursor-pointer'
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
      <SearchInput
        name='search'
        value={searchTerm}
        onValueChange={handleSearchChange}
      />
      <div>
        {isLoading
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
              <div key={index}>
                <RepositoryCardSkeleton />
                {index < itemsPerPage - 1 && <Separator className='my-1' />}
              </div>
            ))
          : repos.map((repo, index) => (
              <div key={repo.id}>
                <RepositoryCard repository={repo} />
                {index < repos.length - 1 && <Separator className='my-1' />}
              </div>
            ))}
      </div>

      {totalRepos > itemsPerPage && (
        <>
          <Separator className='my-2' />
          <Pagination>
            <PaginationContent>{renderPaginationItems()}</PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
