import "server-only";

import { Octokit } from "@octokit/rest";
import { env } from "@repo/env/web";
import { getGitHubRepos as getRepos } from "@repo/github";
import { cacheLife, cacheTag } from "next/cache";

export async function getGitHubRepos(): Promise<
  Awaited<ReturnType<typeof getRepos>>
> {
  "use cache";
  cacheLife("hours");
  cacheTag("github-repos");

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
