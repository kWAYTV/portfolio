import { ArrowUpRight } from 'lucide-react';

import { githubRepoUrl } from '@/lib/metadata';

export default function Footer() {
  return (
    <footer className='mb-8 sm:mb-16'>
      <ul className='font-sm mt-6 flex flex-row space-x-4 text-neutral-600 sm:mt-8 dark:text-neutral-300'>
        <li>
          <a
            href='/rss'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center hover:text-neutral-800 dark:hover:text-neutral-100'
          >
            <ArrowUpRight className='h-4 w-4' />
            <p className='ml-1 text-sm sm:ml-2'>rss</p>
          </a>
        </li>
        <li>
          <a
            href={githubRepoUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center hover:text-neutral-800 dark:hover:text-neutral-100'
          >
            <ArrowUpRight className='h-4 w-4' />
            <p className='ml-1 text-sm sm:ml-2'>source</p>
          </a>
        </li>
      </ul>
      <p className='mt-6 text-sm text-neutral-600 sm:mt-8 dark:text-neutral-300'>
        © {new Date().getFullYear()} MIT Licensed
      </p>
    </footer>
  );
}
