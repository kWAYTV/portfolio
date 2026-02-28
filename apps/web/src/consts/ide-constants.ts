export const REPO_URL = "https://github.com/kWAYTV/portfolio";

/** Commit from GitHub API (matches GitHubCommit from @repo/github) */
export interface Commit {
  author: string;
  date: string; // ISO 8601
  description?: string;
  filesChanged?: number;
  insertions?: number;
  message: string;
  sha: string;
}
