import { ArrowUpRight } from 'lucide-react';
import { Link } from 'next-view-transitions';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getBlogPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';

export async function RecentPosts() {
  const allBlogs = getBlogPosts();
  const recentPosts = allBlogs
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .slice(0, 3);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold tracking-tight'>Recent Posts</h2>
        <Button variant='ghost' size='sm' className='gap-1' asChild>
          <Link href='/blog' className='flex items-center'>
            View all
            <ArrowUpRight className='h-4 w-4' />
          </Link>
        </Button>
      </div>

      <div>
        {recentPosts.map(post => (
          <div key={post.slug}>
            <Link
              className='flex flex-col space-y-1 rounded-md p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900'
              href={`/blog/${post.slug}`}
            >
              <div className='flex w-full flex-row space-x-0 md:space-x-2'>
                <p className='w-[100px] text-neutral-600 tabular-nums dark:text-neutral-400'>
                  {formatDate(post.metadata.publishedAt, false)}
                </p>
                <p className='tracking-tight text-neutral-900 dark:text-neutral-100'>
                  {post.metadata.title}
                </p>
              </div>
            </Link>
            <Separator className='my-2' />
          </div>
        ))}
      </div>
    </div>
  );
}
