import { Skeleton } from "@portfolio/ui";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";

export default function Loading() {
  return (
    <PageWrapper>
      <PageContent className="space-y-5 sm:space-y-6">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </PageContent>
    </PageWrapper>
  );
}
