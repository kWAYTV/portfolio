import { Skeleton } from "@portfolio/ui";

export function BlogListSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-20" />
      <div className="min-h-40 space-y-1">
        {[1, 2, 3].map((i) => (
          <Skeleton className="h-14 w-full rounded-md sm:h-12" key={i} />
        ))}
      </div>
      <div className="flex justify-center pt-2">
        <Skeleton className="h-7 w-24" />
      </div>
    </div>
  );
}
