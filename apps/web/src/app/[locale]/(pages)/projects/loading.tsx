import { Skeleton } from "@portfolio/ui";
import { ProjectListSkeleton } from "@/components/projects/project-list-skeleton";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";

/** Matches projects page structure to avoid content flash. */
export default function Loading() {
  return (
    <PageWrapper>
      <PageContent>
        <header className="space-y-1.5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-40" />
        </header>
        <ProjectListSkeleton />
      </PageContent>
    </PageWrapper>
  );
}
