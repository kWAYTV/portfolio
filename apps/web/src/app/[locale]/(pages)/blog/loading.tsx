import { Skeleton } from "@portfolio/ui";
import { BlogListSkeleton } from "@/components/blog/blog-list-skeleton";
import { PageContent } from "@/components/shared/page-content";

/** Matches blog page structure to avoid content flash. */
export default function Loading() {
  return (
    <PageContent>
      <header className="space-y-1.5">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-full max-w-md" />
      </header>
      <BlogListSkeleton />
    </PageContent>
  );
}
