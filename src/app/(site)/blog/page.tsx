import { Suspense } from 'react';

import { BlogPosts } from '@/components/core/blog/posts';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPage() {
  return (
    <section>
      <h1 className='mb-8 text-2xl font-semibold tracking-tighter'>My Blog</h1>
      <Suspense fallback={<BlogPostsSkeleton />}>
        <BlogPosts />
      </Suspense>
    </section>
  );
}

function BlogPostsSkeleton() {
  return (
    <div className='my-8 space-y-2'>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className='py-2'>
          <div className='flex gap-2'>
            <Skeleton className='h-5 w-[100px]' />
            <Skeleton className='h-5 w-full' />
          </div>
          <Skeleton className='mt-2 h-px w-full' />
        </div>
      ))}
    </div>
  );
}
