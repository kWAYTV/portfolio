import type { Octokit } from "@octokit/rest";

export type { Octokit } from "@octokit/rest";

export interface GitHubCommit {
  author: string;
  date: string;
  description?: string;
  filesChanged?: number;
  insertions?: number;
  message: string;
  sha: string;
}

export interface GetGitHubCommitsOptions {
  octokit: Octokit;
  owner: string;
  perPage?: number;
  repo: string;
}

export interface GitHubRepo {
  archived: boolean;
  created_at: string;
  description: string | null;
  fork: boolean;
  forks_count: number;
  full_name: string;
  homepage: string | null;
  html_url: string;
  id: number;
  language: string | null;
  name: string;
  pushed_at: string;
  stargazers_count: number;
  topics: string[];
}

export interface GetGitHubReposOptions {
  extraRepos?: ReadonlyArray<{ owner: string; repo: string }>;
  octokit: Octokit;
  username: string;
}
