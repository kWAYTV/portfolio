'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { RepositoryCard } from '@/components/core/projects/repository-card';
import { SearchInput } from '@/components/core/projects/search-input';
import { Button } from '@/components/ui/button';
import type { Repository } from '@/interfaces/github';

interface ClientProjectsProps {
  initialRepos: Repository[];
}

export function ClientProjects({ initialRepos }: ClientProjectsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredRepos, setFilteredRepos] = useState(initialRepos);
  const itemsPerPage = 5;

  useEffect(() => {
    const filtered = initialRepos.filter(
      repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRepos(filtered);
    setCurrentPage(1);
  }, [searchTerm, initialRepos]);

  const totalPages = Math.ceil(filteredRepos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRepos = filteredRepos.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <SearchInput onSearch={handleSearch} />
      <div className='my-8'>
        {currentRepos.map(repo => (
          <RepositoryCard key={repo.id} repository={repo} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className='mt-4 flex items-center justify-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400'>
          <Button
            variant='ghost'
            size='icon'
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className='h-7 w-7'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <span className='tabular-nums'>
            {currentPage} / {totalPages}
          </span>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className='h-7 w-7'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      )}
    </div>
  );
}