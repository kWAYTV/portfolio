import { Skeleton } from "@portfolio/ui";
import { PageContent } from "@/components/shared/page-content";

export default function Loading() {
  return (
    <PageContent>
      <header className="space-y-1.5">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-full max-w-md" />
      </header>
      <div className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <div className="min-h-40 space-y-1">
          {[1, 2, 3].map((i) => (
            <Skeleton
              className="h-14 w-full rounded-md sm:h-12"
              key={`post-${i}`}
            />
          ))}
        </div>
      </div>
    </PageContent>
  );
}
