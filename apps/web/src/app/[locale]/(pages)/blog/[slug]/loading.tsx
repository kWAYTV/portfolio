import { Skeleton } from "@portfolio/ui";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";

export default function BlogPostLoading() {
  return (
    <PageWrapper>
      <PageContent className="max-w-lg space-y-4 sm:max-w-xl">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton className="h-4 w-full" key={i} />
          ))}
        </div>
      </PageContent>
    </PageWrapper>
  );
}
