import { getFeaturedRepos } from "@/lib/featured";
import { getGitHubRepos } from "@/lib/github";

import { FeaturedProjects } from "./featured-projects";

export async function FeaturedProjectsLoader() {
  const repos = await getGitHubRepos();
  const featured = getFeaturedRepos(repos);
  return <FeaturedProjects repos={featured} />;
}
