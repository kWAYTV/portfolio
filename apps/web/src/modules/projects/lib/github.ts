import "server-only";

import { Octokit } from "@octokit/rest";
import { env } from "@repo/env/web";
import {
  getGitHubContributions as getContributions,
  getGitHubPinnedRepos as getPinned,
  getGitHubRepos as getRepos,
  type PinnedRepo,
} from "@repo/github";
import { cacheLife, cacheTag } from "next/cache";

export const GITHUB_USER = "kWAYTV";
const EXTRA_REPOS = [{ owner: "versend", repo: "core" }];

export async function getGitHubRepos() {
  "use cache";
  cacheTag("github-repos");
  cacheLife("hours");

  const token = env.GITHUB_TOKEN;
  if (!token) {
    return [];
  }

  const octokit = new Octokit({ auth: token });
  return await getRepos({
    extraRepos: EXTRA_REPOS,
    octokit,
    username: GITHUB_USER,
  });
}

/** Pinned repos from the GitHub profile; falls back to the featured list. */
export async function getGitHubPinnedRepos(): Promise<PinnedRepo[]> {
  "use cache";
  cacheTag("github-pinned");
  cacheLife("hours");

  const token = env.GITHUB_TOKEN;
  if (!token) {
    return [];
  }

  return await getPinned({ token, username: GITHUB_USER });
}

export async function getGitHubContributionCalendar() {
  "use cache";
  cacheTag("github-contributions");
  cacheLife("hours");

  const token = env.GITHUB_TOKEN;
  if (!token) {
    return null;
  }

  return await getContributions({
    token,
    username: GITHUB_USER,
  });
}
