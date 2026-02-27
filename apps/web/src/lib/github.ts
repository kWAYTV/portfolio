import "server-only";

import { Octokit } from "@octokit/rest";
import { env } from "@portfolio/env";
import { getGitHubRepos as getRepos } from "@portfolio/github";
import { cacheLife, cacheTag } from "next/cache";

export interface GitCommitItem {
  author: string;
  date: string;
  message: string;
  sha: string;
}

async function fetchRepoCommits(): Promise<GitCommitItem[]> {
  const octokit = new Octokit({ auth: env.GITHUB_TOKEN });
  const { data } = await octokit.repos.listCommits({
    owner: "kWAYTV",
    repo: "portfolio",
    per_page: 8,
  });
  return data.map((c) => ({
    sha: c.sha.slice(0, 7),
    message: c.commit.message.split("\n")[0],
    author: c.commit.author?.name ?? "Unknown",
    date: formatRelativeDate(
      c.commit.author?.date ?? c.commit.committer?.date ?? ""
    ),
  }));
}

function formatRelativeDate(dateStr: string): string {
  if (!dateStr) {
    return "";
  }
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffMins < 60) {
    return `${diffMins} min ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  return date.toLocaleDateString();
}

export async function getRepoCommits(): Promise<GitCommitItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("commits");
  return await fetchRepoCommits();
}

export async function getGitHubRepos(): Promise<
  Awaited<ReturnType<typeof getRepos>>
> {
  "use cache";
  cacheLife("hours");
  cacheTag("github-repos");

  const octokit = new Octokit({ auth: env.GITHUB_TOKEN });
  return await getRepos({
    octokit,
    username: "kWAYTV",
    extraRepos: [{ owner: "vercord", repo: "core" }],
  });
}
