import { Suspense } from "react";
import { ProjectListLoader } from "@/components/projects/project-list-loader";
import { ProjectListSkeleton } from "@/components/projects/project-list-skeleton";
import { ProjectsHeader } from "@/components/projects/projects-header";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { BlurFade } from "@/components/ui/blur-fade";

export default function Projects() {
  return (
    <PageWrapper>
      <PageContent>
        <BlurFade delay={0}>
          <ProjectsHeader />
        </BlurFade>

        <BlurFade delay={0.1}>
          <Suspense fallback={<ProjectListSkeleton />}>
            <ProjectListLoader />
          </Suspense>
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}
