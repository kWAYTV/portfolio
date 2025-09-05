import { GithubIcon, TwitterIcon } from 'lucide-react';
import { Link } from 'next-view-transitions';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { githubUsername, twitterUsername } from '@/lib/metadata';
import { cn } from '@/lib/utils';

export function Contact() {
  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold tracking-tighter'>Contact</h2>

      <p className='text-muted-foreground mb-4 text-sm'>
        Feel free to connect with me on these platforms
      </p>

      <div className='flex gap-3'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`https://github.com/${githubUsername}`}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub Profile'
              className={cn(
                'text-muted-foreground hover:text-foreground',
                'focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
                'transition-colors'
              )}
            >
              <GithubIcon className='h-4 w-4' aria-hidden='true' />
            </Link>
          </TooltipTrigger>
          <TooltipContent>GitHub</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`https://twitter.com/${twitterUsername}`}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Twitter/X Profile'
              className={cn(
                'text-muted-foreground hover:text-foreground',
                'focus-visible:ring-ring rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
                'transition-colors'
              )}
            >
              <TwitterIcon className='h-4 w-4' aria-hidden='true' />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Twitter / X</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
