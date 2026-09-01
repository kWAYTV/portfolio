import type { GitHubRepo } from "@repo/github";

export const PROJECTS_PER_PAGE = 8;

export type ProjectSort = "updated" | "stars" | "created" | "name";

export function parseProjectSort(value?: string): ProjectSort {
  if (value === "stars" || value === "created" || value === "name") {
    return value;
  }
  return "updated";
}

export function queryProjects(
  repos: GitHubRepo[],
  {
    page,
    q,
    sort,
  }: {
    page: number;
    q: string;
    sort: ProjectSort;
  }
) {
  const query = q.trim().toLowerCase();
  const filtered = query
    ? repos.filter((repo) => {
        const haystack = [
          repo.name,
          repo.full_name,
          repo.description ?? "",
          ...repo.topics,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
    : repos;

  const sorted = filtered.toSorted((a, b) => {
    switch (sort) {
      case "stars":
        return b.stargazers_count - a.stargazers_count;
      case "created":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return (
          new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
        );
    }
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PROJECTS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PROJECTS_PER_PAGE;

  return {
    page: safePage,
    repos: sorted.slice(start, start + PROJECTS_PER_PAGE),
    totalCount: sorted.length,
    totalPages,
  };
}
