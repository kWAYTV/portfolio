import { ProjectList } from "@/components/projects/project-list";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { getGitHubRepos } from "@/lib/github";

export default async function Projects() {
  const repos = await getGitHubRepos();

  return (
    <PageWrapper>
      <PageContent>
        <header className="space-y-1.5">
          <h1 className="font-medium text-base tracking-tight sm:text-lg">
            Projects
          </h1>
          <p className="text-muted-foreground/60 text-xs sm:text-sm">
            Open source work
          </p>
        </header>

        <ProjectList repos={repos} />
      </PageContent>
    </PageWrapper>
  );
}
