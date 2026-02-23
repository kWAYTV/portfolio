import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedProjectsSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-14" />
      </div>
      <ul className="space-y-0.5">
        {[1, 2, 3].map((i) => (
          <li key={i}>
            <Skeleton className="h-8 w-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
