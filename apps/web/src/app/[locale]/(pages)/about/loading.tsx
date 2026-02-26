import { Skeleton } from "@portfolio/ui";
import { PageContent } from "@/components/shared/page-content";

export default function Loading() {
  return (
    <PageContent>
      <header className="space-y-1.5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-32" />
      </header>
      <Skeleton className="h-12 w-full" />
      <section className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div className="flex gap-3" key={`exp-${i}`}>
              <Skeleton className="size-2 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1">
                <div className="flex gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageContent>
  );
}
