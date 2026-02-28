import type { GitHubRepo } from "@repo/github";

import { FEATURED_COUNT, featuredRepoNames } from "@/consts/featured-repos";

export function getFeaturedRepos(repos: GitHubRepo[]): GitHubRepo[] {
  const featured: GitHubRepo[] = [];

  for (const name of featuredRepoNames) {
    const repo = repos.find((r) => r.name === name || r.full_name === name);
    if (repo) {
      featured.push(repo);
    }
  }

  if (featured.length < FEATURED_COUNT) {
    const remaining = repos
      .filter((r) => !featured.includes(r))
      .sort((a, b) => b.stargazers_count - a.stargazers_count);

    for (const repo of remaining) {
      if (featured.length >= FEATURED_COUNT) {
        break;
      }
      featured.push(repo);
    }
  }

  return featured.slice(0, FEATURED_COUNT);
}
