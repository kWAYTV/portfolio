import { Suspense } from 'react';

import { RecentPosts } from '@/components/core/blog/recent-posts';
import { AnimationWrapper } from '@/components/core/home/animation-wrapper';
import { Description } from '@/components/core/home/description';
import { Hero } from '@/components/core/home/hero';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  return (
    <section>
      <AnimationWrapper direction='down'>
        <Hero />
      </AnimationWrapper>
      <AnimationWrapper delay={0.2}>
        <Description />
      </AnimationWrapper>
      <div className='my-8'>
        <Suspense fallback={<RecentPostsSkeleton />}>
          <RecentPosts />
        </Suspense>
      </div>
    </section>
  );
}

function RecentPostsSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-7 w-40' />
        <Skeleton className='h-9 w-24' />
      </div>
      <div className='space-y-2'>
        {[1, 2, 3].map(i => (
          <div key={i} className='py-2'>
            <div className='flex gap-2'>
              <Skeleton className='h-5 w-[100px]' />
              <Skeleton className='h-5 w-full' />
            </div>
            <Skeleton className='mt-2 h-px w-full' />
          </div>
        ))}
      </div>
    </div>
  );
}
