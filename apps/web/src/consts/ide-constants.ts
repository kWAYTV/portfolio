export const REPO_URL = "https://github.com/kWAYTV/ide-portfolio";

/** Commit from GitHub API (matches GitHubCommit from @repo/github) */
export interface Commit {
  author: string;
  date: string; // ISO 8601
  filesChanged?: number;
  insertions?: number;
  message: string;
  sha: string;
}
