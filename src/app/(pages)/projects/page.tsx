import { Suspense } from "react";
import { ProjectList } from "@/components/projects/project-list";
import { ProjectListSkeleton } from "@/components/projects/project-skeleton";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Separator } from "@/components/ui/separator";
import { getGitHubRepos } from "@/lib/github";

async function ProjectsContent() {
  const repos = await getGitHubRepos();

  return <ProjectList repos={repos} />;
}

export default function Projects() {
  return (
    <PageWrapper>
      <PageContent>
        <div className="space-y-1">
          <h1 className="font-medium text-base tracking-tight sm:text-lg">
            Projects
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Open source work
          </p>
        </div>

        <Separator />

        <Suspense fallback={<ProjectListSkeleton />}>
          <ProjectsContent />
        </Suspense>
      </PageContent>
    </PageWrapper>
  );
}
