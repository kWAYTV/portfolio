import { GithubIcon, TwitterIcon } from 'lucide-react';
import Link from 'next/link';

import { githubUsername, twitterUsername } from '@/lib/metadata';
import { cn } from '@/lib/utils';

export function Contact() {
  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold tracking-tighter'>Contact</h2>

      <p className='text-muted-foreground mb-4 text-sm'>
        Feel free to connect with me on these platforms
      </p>

      <div className='flex gap-4'>
        <Link
          href={`https://github.com/${githubUsername}`}
          target='_blank'
          rel='noopener noreferrer'
          aria-label='GitHub Profile'
          className={cn(
            'text-muted-foreground hover:text-foreground',
            'transition-transform hover:scale-110'
          )}
        >
          <GithubIcon className='h-5 w-5' />
        </Link>

        <Link
          href={`https://twitter.com/${twitterUsername}`}
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Twitter/X Profile'
          className={cn(
            'text-muted-foreground hover:text-foreground',
            'transition-transform hover:scale-110'
          )}
        >
          <TwitterIcon className='h-5 w-5' />
        </Link>
      </div>
    </div>
  );
}
