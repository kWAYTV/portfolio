import { Skeleton } from "@portfolio/ui";
import { PageContent } from "@/components/shared/page-content";

export default function Loading() {
  return (
    <PageContent>
      <header className="space-y-1.5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-40" />
      </header>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-20 sm:w-28" />
        </div>
        <Skeleton className="h-4 w-24" />
        <div className="space-y-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton className="h-10 w-full" key={`proj-${i}`} />
          ))}
        </div>
      </div>
    </PageContent>
  );
}
