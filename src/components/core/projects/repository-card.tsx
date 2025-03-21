import {
  GitFork,
  Globe2,
  LinkIcon,
  LockIcon,
  Scroll,
  Star
} from 'lucide-react';
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
    <div className='group rounded-md p-1.5 transition-colors hover:bg-neutral-100 sm:p-2 dark:hover:bg-neutral-900'>
      <div className='flex w-full flex-col space-y-1.5 sm:space-y-2'>
        <div className='flex flex-col space-y-1.5 sm:flex-row sm:items-start sm:justify-between sm:space-y-0'>
          <div className='flex items-center gap-1.5 sm:gap-2'>
            <Button
              variant='link'
              asChild
              className='h-auto p-0 text-sm font-medium tracking-tight text-neutral-900 hover:bg-transparent hover:text-neutral-700 sm:text-base dark:text-neutral-100 dark:hover:text-neutral-300'
            >
              <Link
                href={repository.html_url}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1'
              >
                <LinkIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                <span className='line-clamp-1'>{repository.name}</span>
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
            {repository.license && (
              <Tooltip>
                <TooltipTrigger>
                  <Scroll className='h-3.5 w-3.5 text-neutral-500 sm:h-4 sm:w-4' />
                </TooltipTrigger>
                <TooltipContent>{repository.license.name}</TooltipContent>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <span className='hidden tabular-nums transition-colors hover:text-neutral-900 sm:inline dark:hover:text-neutral-100'>
                  {repository.updated_at && formatDate(repository.updated_at)}
                </span>
              </TooltipTrigger>
              <TooltipContent>Last updated</TooltipContent>
            </Tooltip>
            <div className='flex items-center gap-2'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='flex items-center gap-1 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100'>
                    <Star className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                    <span>{repository.stargazers_count}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Stars</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='flex items-center gap-1 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100'>
                    <GitFork className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                    <span>{repository.forks_count}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Forks</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-1.5 sm:gap-2'>
          <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
            <Badge
              variant='outline'
              className='bg-neutral-50 px-2 py-0.5 text-xs dark:bg-neutral-900'
            >
              {repository.language || 'Unknown'}
            </Badge>
            {repository.archived && (
              <Badge
                variant='secondary'
                className='bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-900/80'
              >
                Archived
              </Badge>
            )}
            {repository.is_template && (
              <Badge
                variant='secondary'
                className='bg-blue-100 px-2 py-0.5 text-xs text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-900/80'
              >
                Template
              </Badge>
            )}
            <span className='text-xs text-neutral-600 sm:hidden dark:text-neutral-400'>
              {repository.updated_at && formatDate(repository.updated_at)}
            </span>
          </div>

          {repository.description && (
            <Tooltip>
              <TooltipTrigger asChild>
                <p className='line-clamp-2 cursor-default text-xs text-neutral-600 sm:text-sm dark:text-neutral-400'>
                  {repository.description}
                </p>
              </TooltipTrigger>
              <TooltipContent side='bottom' className='max-w-[300px]'>
                {repository.description}
              </TooltipContent>
            </Tooltip>
          )}

          {repository.topics.length > 0 && (
            <div className='flex flex-wrap gap-1.5'>
              {repository.topics.map(topic => (
                <Badge
                  key={topic}
                  variant='secondary'
                  className='bg-neutral-100 px-2 py-0.5 text-xs text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                >
                  {topic}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
