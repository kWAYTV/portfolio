import { Suspense } from "react";
import { ProjectListLoader } from "@/components/projects/project-list-loader";
import { ProjectListSkeleton } from "@/components/projects/project-list-skeleton";
import { ProjectsHeader } from "@/components/projects/projects-header";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Projects | Martin Vila",
  description: "Open source work",
  imagePath: "/projects/opengraph-image",
  openGraph: { type: "website" },
});

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
