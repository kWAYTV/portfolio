import { ArrowUpRight, GithubIcon, TwitterIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { githubUsername, twitterUsername } from '@/lib/metadata';

export function Contacts() {
  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold tracking-tighter'>Contacts</h2>

      <p className='text-muted-foreground mb-4 text-sm'>
        Feel free to connect with me on these platforms
      </p>

      <div className='grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4'>
        <Button
          variant='outline'
          size='sm'
          className='hover:bg-muted/50 w-full justify-start transition-colors'
          asChild
        >
          <Link
            href={`https://github.com/${githubUsername}`}
            target='_blank'
            rel='noopener noreferrer'
            className='group flex items-center gap-2'
          >
            <GithubIcon className='h-4 w-4' />
            <span className='flex-1'>GitHub</span>
            <ArrowUpRight className='h-3 w-3 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
          </Link>
        </Button>

        <Button
          variant='outline'
          size='sm'
          className='hover:bg-muted/50 w-full justify-start transition-colors'
          asChild
        >
          <Link
            href={`https://twitter.com/${twitterUsername}`}
            target='_blank'
            rel='noopener noreferrer'
            className='group flex items-center gap-2'
          >
            <TwitterIcon className='h-4 w-4' />
            <span className='flex-1'>X</span>
            <ArrowUpRight className='h-3 w-3 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
          </Link>
        </Button>
      </div>
    </div>
  );
}
