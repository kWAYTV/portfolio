import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

export function ProjectsSkeleton() {
  return (
    <div className='w-full space-y-4'>
      <div className='flex items-center space-x-2'>
        <Skeleton className='h-9 w-[300px]' />
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Repository</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Stars</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-3 w-48' />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-16' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-12' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between space-x-2 py-4'>
        <Skeleton className='h-4 w-48' />
        <div className='flex items-center gap-1'>
          <Skeleton className='h-9 w-20' /> {/* Previous */}
          <Skeleton className='h-9 w-9' /> {/* Page 1 */}
          <Skeleton className='h-9 w-9' /> {/* Page 2 */}
          <Skeleton className='h-9 w-9' /> {/* Page 3 */}
          <Skeleton className='h-9 w-16' /> {/* Next */}
        </div>
      </div>
    </div>
  );
}
