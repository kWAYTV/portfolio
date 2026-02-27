import { Separator, Skeleton } from "@portfolio/ui";
import { PageContent } from "@/components/shared/page-content";

/**
 * Skeleton content for the main editor area during initial load.
 * Matches the home page structure for a smooth transition.
 * Used in both root layout Suspense fallback and [locale] loading.tsx.
 */
export function PageLoadingSkeleton() {
  return (
    <PageContent>
      <Skeleton className="h-4 w-20" />
      <header className="space-y-1.5">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-40" />
      </header>
      <Skeleton className="h-12 w-full" />
      <Separator className="bg-border/50" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton className="h-4 w-16" key={`social-${i}`} />
        ))}
      </div>
      <Separator className="bg-border/50" />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-14" />
        </div>
        <div className="space-y-1">
          {[1, 2, 3].map((i) => (
            <Skeleton
              className="h-14 w-full rounded-md sm:h-12"
              key={`feat-${i}`}
            />
          ))}
        </div>
      </div>
    </PageContent>
  );
}
