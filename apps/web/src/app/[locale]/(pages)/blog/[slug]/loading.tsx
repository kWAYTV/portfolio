import { Skeleton } from "@portfolio/ui";
import { PageContent } from "@/components/shared/page-content";

/** Matches blog post structure (back link, header, article) to avoid content flash. */
export default function BlogPostLoading() {
  return (
    <PageContent className="max-w-lg sm:max-w-xl">
      <Skeleton className="h-3 w-16" />
      <header className="space-y-1.5">
        <Skeleton className="h-5 w-3/4 sm:h-6" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </header>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton className="h-4 w-full" key={i} />
        ))}
      </div>
    </PageContent>
  );
}
