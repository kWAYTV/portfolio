import { Skeleton } from "@portfolio/ui";

/**
 * Minimal skeleton for the main content area. Shown while page content streams.
 * Keeps the IDE chrome visible for faster perceived load (better LCP).
 */
export function PageContentSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[75%]" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}
