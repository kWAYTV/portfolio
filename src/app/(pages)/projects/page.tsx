import { Suspense } from "react";
import { ProjectList } from "@/components/projects/project-list";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { BlurFade } from "@/components/ui/blur-fade";
import { Skeleton } from "@/components/ui/skeleton";
import { getGitHubRepos } from "@/lib/github";

async function ProjectListLoader() {
  const repos = await getGitHubRepos();
  return <ProjectList repos={repos} />;
}

function ProjectListSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-20 sm:w-28" />
      </div>
      <Skeleton className="h-4 w-24" />
      <div className="space-y-0.5">
        {["a", "b", "c", "d", "e"].map((id) => (
          <Skeleton className="h-10 w-full" key={id} />
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <PageWrapper>
      <PageContent>
        <BlurFade delay={0}>
          <header className="space-y-1.5">
            <h1 className="font-medium text-base tracking-tight sm:text-lg">
              Projects
            </h1>
            <p className="text-muted-foreground/60 text-xs sm:text-sm">
              Open source work
            </p>
          </header>
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
