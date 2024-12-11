import { GitFork, LockIcon, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import type { Repository } from '@/interfaces/github';
import { formatDate } from '@/lib/utils';

interface RepositoryCardProps {
  repository: Repository;
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <div className='group rounded-md p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900'>
      <div className='flex w-full flex-col space-y-2'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-2'>
            <Button
              variant='link'
              asChild
              className='h-auto p-0 text-base font-medium tracking-tight text-neutral-900 hover:bg-transparent hover:text-neutral-700 dark:text-neutral-100 dark:hover:text-neutral-300'
            >
              <a
                href={repository.html_url}
                target='_blank'
                rel='noopener noreferrer'
              >
                {repository.name}
              </a>
            </Button>
            {repository.private && (
              <Tooltip>
                <TooltipTrigger>
                  <LockIcon className='h-4 w-4 text-neutral-500' />
                </TooltipTrigger>
                <TooltipContent>Private repository</TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className='flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400'>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className='tabular-nums transition-colors hover:text-neutral-900 dark:hover:text-neutral-100'>
                  {repository.updated_at && formatDate(repository.updated_at)}
                </span>
              </TooltipTrigger>
              <TooltipContent>Last updated</TooltipContent>
            </Tooltip>
            <div className='flex items-center gap-2'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='flex items-center gap-1 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100'>
                    <Star className='h-4 w-4' />
                    <span>{repository.stargazers_count}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Stars</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='flex items-center gap-1 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100'>
                    <GitFork className='h-4 w-4' />
                    <span>{repository.forks_count}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Forks</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-x-4 text-sm'>
          <Badge
            variant='outline'
            className='bg-neutral-50 dark:bg-neutral-900'
          >
            {repository.language || 'Unknown'}
          </Badge>
          {repository.description && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className='line-clamp-1 cursor-default text-neutral-600 dark:text-neutral-400'>
                  {repository.description}
                </span>
              </TooltipTrigger>
              <TooltipContent side='bottom' className='max-w-[300px]'>
                {repository.description}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
