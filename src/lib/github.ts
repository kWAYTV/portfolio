import "server-only";

import { Octokit } from "@octokit/rest";
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
const EXTRA_REPOS = [{ owner: "vercord", repo: "core" }] as const;

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  "use cache";
  cacheLife("hours");

  const [userRepos, ...extraRepos] = await Promise.all([
    octokit.paginate(octokit.repos.listForUser, {
      username: GITHUB_USERNAME,
      per_page: 100,
      sort: "updated",
    }),
    ...EXTRA_REPOS.map(({ owner, repo }) =>
      octokit.repos.get({ owner, repo }).then((res) => res.data)
    ),
  ]);

  const repos = [...userRepos, ...extraRepos];

  return repos
    .filter((repo) => !(repo.fork || repo.archived))
    .map((repo) => ({
      id: repo.id,
      name: repo.full_name.startsWith(`${GITHUB_USERNAME}/`)
        ? repo.name
        : repo.full_name,
      full_name: repo.full_name,
      description: repo.description ?? null,
      html_url: repo.html_url,
      homepage: repo.homepage ?? null,
      stargazers_count: repo.stargazers_count ?? 0,
      forks_count: repo.forks_count ?? 0,
      language: repo.language ?? null,
      topics: repo.topics ?? [],
      pushed_at: repo.pushed_at ?? "",
      created_at: repo.created_at ?? "",
      fork: repo.fork ?? false,
      archived: repo.archived ?? false,
    }));
}
