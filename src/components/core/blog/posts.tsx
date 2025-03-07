import { Link } from 'next-view-transitions';

import { Separator } from '@/components/ui/separator';
import { getBlogPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';

export function BlogPosts() {
  const allBlogs = getBlogPosts();

  return (
    <div className='my-8'>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map(post => (
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
  );
}
