import "server-only";

import { Octokit } from "@octokit/rest";
import { env } from "@repo/env/web";
import { getGitHubRepos as getRepos } from "@repo/github";
import { unstable_cache } from "next/cache";

async function fetchGitHubRepos(): Promise<
  Awaited<ReturnType<typeof getRepos>>
> {
  const token = env.GITHUB_TOKEN;
  if (!token) {
    return [];
  }

  const octokit = new Octokit({ auth: token });
  return await getRepos({
    octokit,
    username: "kWAYTV",
  });
}

export const getGitHubRepos = unstable_cache(
  fetchGitHubRepos,
  ["github-repos"],
  { revalidate: 3600, tags: ["github-repos"] }
);
