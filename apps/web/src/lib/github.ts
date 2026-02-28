import "server-only";

import { Octokit } from "@octokit/rest";
import { env } from "@repo/env/web";
import {
  getGitHubCommits as getCommits,
  getGitHubRepos as getRepos,
} from "@repo/github";
import { unstable_cache } from "next/cache";

const REPO_OWNER = "kWAYTV";
const REPO_NAME = "portfolio";

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
    extraRepos: [{ owner: "versend", repo: "core" }],
  });
}

async function fetchGitHubCommits(): Promise<
  Awaited<ReturnType<typeof getCommits>>
> {
  const token = env.GITHUB_TOKEN;
  if (!token) {
    return [];
  }

  const octokit = new Octokit({ auth: token });
  return await getCommits({
    octokit,
    owner: REPO_OWNER,
    perPage: 15,
    repo: REPO_NAME,
  });
}

export const getGitHubCommits = unstable_cache(
  fetchGitHubCommits,
  ["github-commits"],
  { revalidate: 300, tags: ["github-commits"] }
);

export const getGitHubRepos = unstable_cache(
  fetchGitHubRepos,
  ["github-repos"],
  { revalidate: 3600, tags: ["github-repos"] }
);
