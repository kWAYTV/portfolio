import { ArrowUpRight, GithubIcon, TwitterIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { githubUsername, twitterUsername } from '@/lib/metadata';

export function Contacts() {
  return (
    <>
      <h2 className='mb-8 text-2xl font-semibold tracking-tighter'>Contacts</h2>
      <div className='flex flex-row gap-4'>
        <Button variant='ghost' size='sm' asChild>
          <Link
            href={`https://github.com/${githubUsername}`}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1'
          >
            <GithubIcon className='h-4 w-4' />
            GitHub
            <ArrowUpRight className='h-3 w-3' />
          </Link>
        </Button>

        <Button variant='ghost' size='sm' asChild>
          <Link
            href={`https://twitter.com/${twitterUsername}`}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1'
          >
            <TwitterIcon className='h-4 w-4' />
            Twitter
            <ArrowUpRight className='h-3 w-3' />
          </Link>
        </Button>
      </div>
    </>
  );
}
