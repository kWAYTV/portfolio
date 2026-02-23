import { FeaturedProjects } from "@/components/home/featured-projects";
import { getFeaturedRepos } from "@/lib/featured";
import { getGitHubRepos } from "@/lib/github";

export async function FeaturedProjectsLoader() {
  const repos = await getGitHubRepos();
  const featured = getFeaturedRepos(repos);
  return <FeaturedProjects repos={featured} />;
}
