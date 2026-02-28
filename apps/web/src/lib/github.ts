import "server-only";

import { Octokit } from "@octokit/rest";
import { env } from "@repo/env/web";
import {
  type GitHubCommit,
  getGitHubCommits as getCommits,
  getGitHubRepos as getRepos,
} from "@repo/github";
import { cacheLife, cacheTag } from "next/cache";

const REPO_OWNER = "kWAYTV";
const REPO_NAME = "ide-portfolio";

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

export async function getGitHubCommits(): Promise<GitHubCommit[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("github-commits");

  const token = env.GITHUB_TOKEN;
  if (!token) {
    return [];
  }

  const octokit = new Octokit({ auth: token });
  return await getCommits({
    octokit,
    owner: REPO_OWNER,
    repo: REPO_NAME,
    perPage: 15,
  });
}
