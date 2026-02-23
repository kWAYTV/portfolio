import "server-only";

import { Octokit } from "@octokit/rest";
import { env } from "@portfolio/env";
import { getGitHubRepos as getRepos } from "@portfolio/github";
import { cacheLife } from "next/cache";

export type { GitHubRepo } from "@portfolio/github";

export async function getGitHubRepos(): Promise<
  Awaited<ReturnType<typeof getRepos>>
> {
  "use cache";
  cacheLife("hours");

  const octokit = new Octokit({ auth: env.GITHUB_TOKEN });
  return await getRepos({
    octokit,
    username: "kWAYTV",
    extraRepos: [{ owner: "vercord", repo: "core" }],
  });
}
