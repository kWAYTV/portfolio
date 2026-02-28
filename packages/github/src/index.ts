import type {
  GetGitHubCommitsOptions,
  GetGitHubReposOptions,
  GitHubCommit,
  GitHubRepo,
} from "./types.js";

export type {
  GetGitHubCommitsOptions,
  GetGitHubReposOptions,
  GitHubCommit,
  GitHubRepo,
  Octokit,
} from "./types.js";

export async function getGitHubCommits({
  octokit,
  owner,
  repo,
  perPage = 10,
}: GetGitHubCommitsOptions): Promise<GitHubCommit[]> {
  const { data } = await octokit.repos.listCommits({
    owner,
    page: 1,
    per_page: perPage,
    repo,
  });

  return data.map((c) => {
    const author = c.commit?.author?.name ?? c.author?.login ?? "Unknown";
    const date = c.commit?.author?.date
      ? new Date(c.commit.author.date).toISOString()
      : "";
    return {
      author,
      date,
      message: (c.commit?.message ?? "").split("\n")[0] ?? "",
      sha: c.sha ?? "",
    };
  });
}

export async function getGitHubRepos({
  octokit,
  username,
  extraRepos = [],
}: GetGitHubReposOptions): Promise<GitHubRepo[]> {
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
