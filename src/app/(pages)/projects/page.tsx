import { Suspense } from "react";
import { ProjectListLoader } from "@/components/projects/project-list-loader";
import { ProjectListSkeleton } from "@/components/projects/project-list-skeleton";
import { ProjectsHeader } from "@/components/projects/projects-header";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";

export default function Projects() {
  return (
    <PageWrapper>
      <PageContent>
        <ProjectsHeader />
        <Suspense fallback={<ProjectListSkeleton />}>
          <ProjectListLoader />
        </Suspense>
      </PageContent>
    </PageWrapper>
  );
}
