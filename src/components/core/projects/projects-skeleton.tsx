import { RepositoryCardSkeleton } from '@/components/core/projects/repository-card-skeleton';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export function ProjectsSkeleton() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-9 w-full' />
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <RepositoryCardSkeleton />
            {i < 4 && <Separator className='my-0.5 sm:my-1' />}
          </div>
        ))}
      </div>
    </div>
  );
}
