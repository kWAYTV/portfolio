import { Skeleton } from '@/components/ui/skeleton';

export function RepositoryCardSkeleton() {
  return (
    <div className='p-1.5 sm:p-2'>
      <div className='flex w-full flex-col space-y-2'>
        <div className='flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-28 sm:w-36' />
            <Skeleton className='h-4 w-4' />
          </div>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-4 w-16' />
            <div className='flex items-center gap-2'>
              <Skeleton className='h-4 w-6' />
              <Skeleton className='h-4 w-6' />
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-16' />
          </div>
          <Skeleton className='h-4 w-full max-w-[600px]' />
          <div className='flex flex-wrap gap-1.5'>
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-5 w-14' />
          </div>
        </div>
      </div>
    </div>
  );
}
