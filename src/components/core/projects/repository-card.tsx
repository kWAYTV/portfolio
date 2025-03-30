import { GitFork, Globe2, LinkIcon, LockIcon, Star } from 'lucide-react';
import { Link } from 'next-view-transitions';

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
    <div className='group rounded-md p-1.5 transition-colors hover:bg-neutral-50 sm:p-2 dark:hover:bg-neutral-900'>
      <div className='flex w-full flex-col space-y-1.5 sm:space-y-2'>
        <div className='flex flex-col space-y-1.5 sm:flex-row sm:items-start sm:justify-between sm:space-y-0'>
          <div className='flex items-center gap-1.5 sm:gap-2'>
            <Button
              variant='link'
              asChild
              className='h-auto p-0 text-sm font-medium tracking-tight hover:text-neutral-700 sm:text-base dark:hover:text-neutral-300'
            >
              <Link
                href={repository.html_url}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1'
              >
                <LinkIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                <span>{repository.name}</span>
              </Link>
            </Button>
            {repository.private && (
              <Tooltip>
                <TooltipTrigger>
                  <LockIcon className='h-3.5 w-3.5 text-neutral-500 sm:h-4 sm:w-4' />
                </TooltipTrigger>
                <TooltipContent>Private repository</TooltipContent>
              </Tooltip>
            )}
            {repository.homepage && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={repository.homepage}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
                  >
                    <Globe2 className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                  </a>
                </TooltipTrigger>
                <TooltipContent>Live demo</TooltipContent>
              </Tooltip>
            )}
          </div>
          <div className='flex items-center gap-3 text-xs text-neutral-600 sm:gap-4 sm:text-sm dark:text-neutral-400'>
            <span className='tabular-nums'>
              {repository.updated_at && formatDate(repository.updated_at)}
            </span>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1'>
                <Star className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                <span>{repository.stargazers_count}</span>
              </div>
              <div className='flex items-center gap-1'>
                <GitFork className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                <span>{repository.forks_count}</span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-1.5 sm:gap-2'>
          <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
            {repository.language && (
              <Badge
                variant='outline'
                className='bg-neutral-50 px-2 py-0.5 text-xs dark:bg-neutral-900'
              >
                {repository.language}
              </Badge>
            )}
            {repository.archived && (
              <Badge
                variant='secondary'
                className='bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              >
                Archived
              </Badge>
            )}
          </div>

          {repository.description && (
            <p className='text-xs text-neutral-600 sm:text-sm dark:text-neutral-400'>
              {repository.description}
            </p>
          )}

          {repository.topics.length > 0 && (
            <div className='flex flex-wrap gap-1.5'>
              {repository.topics.slice(0, 6).map(topic => (
                <Badge
                  key={topic}
                  variant='secondary'
                  className='bg-neutral-100 px-2 py-0.5 text-xs text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                >
                  {topic}
                </Badge>
              ))}
              {repository.topics.length > 6 && (
                <span className='text-xs text-neutral-500'>
                  +{repository.topics.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
