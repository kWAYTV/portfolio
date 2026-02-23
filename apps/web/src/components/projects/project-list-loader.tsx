import { ProjectList } from "@/components/projects/project-list";
import { getGitHubRepos } from "@/lib/github";

export async function ProjectListLoader() {
  const repos = await getGitHubRepos();
  return <ProjectList repos={repos} />;
}
