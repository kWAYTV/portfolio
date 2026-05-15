import { ProjectList } from "@/modules/projects/components/project-list";
import { getGitHubRepos } from "@/modules/projects/lib/github";

export async function ProjectListLoader() {
  const repos = await getGitHubRepos();
  return <ProjectList repos={repos} />;
}
