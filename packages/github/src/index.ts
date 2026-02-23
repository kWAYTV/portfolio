import type { Octokit } from "@octokit/rest";

// biome-ignore lint/performance/noBarrelFile: Re-export Octokit for app convenience
export { Octokit } from "@octokit/rest";

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

export interface ExtraRepo {
  owner: string;
  repo: string;
}

export async function getGitHubRepos(
  octokit: Octokit,
  username: string,
  extraRepos: ExtraRepo[] = []
): Promise<GitHubRepo[]> {
  const [userRepos, ...extraReposData] = await Promise.all([
    octokit.paginate(octokit.repos.listForUser, {
      username,
      per_page: 100,
      sort: "updated",
    }),
    ...extraRepos.map(({ owner, repo }) =>
      octokit.repos.get({ owner, repo }).then((res) => res.data)
    ),
  ]);

  const repos = [...userRepos, ...extraReposData];

  return repos
    .filter((repo) => !(repo.fork || repo.archived))
    .map((repo) => ({
      id: repo.id,
      name: repo.full_name.startsWith(`${username}/`)
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
    }))
    .sort(
      (a, b) =>
        new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
    );
}
