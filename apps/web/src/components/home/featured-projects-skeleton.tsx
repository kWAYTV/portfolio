import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedProjectsSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-14" />
      </div>
      <ul className="space-y-1">
        {[1, 2, 3].map((i) => (
          <li key={i}>
            <Skeleton className="h-14 w-full rounded-md sm:h-12" />
          </li>
        ))}
      </ul>
    </div>
  );
}
