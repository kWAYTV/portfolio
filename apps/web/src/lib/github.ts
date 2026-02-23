import "server-only";

import { Octokit } from "@octokit/rest";
import { env } from "@portfolio/env";
import { getGitHubRepos as getRepos } from "@portfolio/github";
import { unstable_cache } from "next/cache";

export async function getGitHubRepos(): Promise<
  Awaited<ReturnType<typeof getRepos>>
> {
  return await unstable_cache(
    async () => {
      const octokit = new Octokit({ auth: env.GITHUB_TOKEN });
      return await getRepos({
        octokit,
        username: "kWAYTV",
        extraRepos: [{ owner: "vercord", repo: "core" }],
      });
    },
    ["github-repos"],
    { revalidate: 3600 }
  )();
}
