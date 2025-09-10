'use client';

import { Link } from 'next-view-transitions';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { navItems } from '@/enums/nav';
import type { NavPath } from '@/types/nav';
import { ArrowUpRight } from 'lucide-react';

export function Navbar() {
  return (
    <aside className='mb-8 tracking-tight sm:mb-16'>
      <div className='lg:sticky lg:top-20'>
        <nav
          className='fade relative flex scroll-pr-6 flex-row items-start px-0 pb-0 md:relative md:overflow-auto'
          id='nav'
        >
          <div className='flex w-full flex-row items-center justify-between pr-2 sm:justify-start sm:space-x-1 sm:pr-10'>
            <div className='flex flex-row space-x-0 sm:space-x-1'>
              {(
                Object.entries(navItems) as [
                  NavPath,
                  (typeof navItems)[NavPath]
                ][]
              ).map(([path, { name, icon: Icon, tooltip }]) => (
                <Tooltip key={path}>
                  <TooltipTrigger asChild>
                    <Button
                      variant='linkHover2'
                      className='flex items-center gap-1 p-1.5 sm:gap-2 sm:p-2'
                      asChild
                    >
                      <Link
                        href={
                          name.toLowerCase() === 'résumé'
                            ? 'https://gitroll.io/profile/uezq54oxIk4VFZkLigfxGmGgm57z1'
                            : path
                        }
                        aria-label={`Navigate to ${name}`}
                        {...(name.toLowerCase() === 'github' ||
                        name.toLowerCase() === 'résumé'
                          ? {
                              target: '_blank',
                              rel: 'noopener noreferrer'
                            }
                          : {})}
                      >
                        <Icon className='h-4 w-4' aria-hidden='true' />
                        <span className='hidden capitalize sm:inline'>
                          {name}
                        </span>
                        {(name.toLowerCase() === 'github' ||
                          name.toLowerCase() === 'résumé') && (
                          <ArrowUpRight
                            className='h-3 w-3 opacity-70'
                            aria-hidden='true'
                          />
                        )}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{tooltip}</TooltipContent>
                </Tooltip>
              ))}
            </div>
            <ModeToggle />
          </div>
        </nav>
      </div>
    </aside>
  );
}
