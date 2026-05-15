import "server-only";

import { Octokit } from "@octokit/rest";
import { env } from "@repo/env/web";
import {
  getGitHubCommits as getCommits,
  getGitHubRepos as getRepos,
} from "@repo/github";
import { cacheLife, cacheTag } from "next/cache";

const REPO_OWNER = "kWAYTV";
const REPO_NAME = "portfolio";
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
    octokit,
    username: REPO_OWNER,
    extraRepos: EXTRA_REPOS,
  });
}

export async function getGitHubCommits() {
  "use cache";
  cacheTag("github-commits");
  cacheLife({ revalidate: 300 });

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
