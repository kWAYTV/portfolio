import "server-only";

import type { GitHubRepo } from "@portfolio/github";
import { getGitHubRepos as getRepos, Octokit } from "@portfolio/github";
import { cacheLife } from "next/cache";
import { env } from "@/env";

export type { GitHubRepo } from "@portfolio/github";

const GITHUB_USERNAME = "kWAYTV";
const EXTRA_REPOS = [{ owner: "vercord", repo: "core" }] as const;

const octokit = new Octokit({
  auth: env.GITHUB_TOKEN,
});

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  "use cache";
  cacheLife("hours");

  return await getRepos(octokit, GITHUB_USERNAME, [...EXTRA_REPOS]);
}
