import "server-only";

import { cacheLife } from "next/cache";

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string;
  created_at: string;
  fork: boolean;
  archived: boolean;
};

const GITHUB_USERNAME = "kWAYTV";

const headers = {
  Accept: "application/vnd.github.v3+json",
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
};

async function fetchAllPages(): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&page=${page}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();

    if (repos.length === 0) {
      break;
    }

    allRepos.push(...repos);

    if (repos.length < 100) {
      break;
    }

    page += 1;
  }

  return allRepos;
}

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  "use cache";
  cacheLife("hours");

  const repos = await fetchAllPages();

  return repos.filter((repo) => !(repo.fork || repo.archived));
}
