"use client";

import { analytics } from "@repo/analytics";
import type { GitHubRepo } from "@repo/github";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { useCallback, useMemo } from "react";
import {
  type SortOption,
  sortOptions,
} from "@/modules/projects/components/project-filters";

export const PROJECTS_PER_PAGE = 5;

const projectSearchParams = {
  q: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(sortOptions).withDefault("updated"),
  page: parseAsInteger.withDefault(1),
};

function matchesQuery(repo: GitHubRepo, query: string): boolean {
  if (!query) {
    return true;
  }
  return (
    repo.name.toLowerCase().includes(query) ||
    Boolean(repo.description?.toLowerCase().includes(query)) ||
    Boolean(repo.language?.toLowerCase().includes(query))
  );
}

function compareRepos(a: GitHubRepo, b: GitHubRepo, sort: SortOption): number {
  switch (sort) {
    case "stars":
      return b.stargazers_count - a.stargazers_count;
    case "updated":
      return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
    case "created":
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case "name":
      return a.name.localeCompare(b.name);
    default:
      return 0;
  }
}

export function useProjectsQuery(repos: GitHubRepo[]) {
  const [{ q, sort, page }, setParams] = useQueryStates(projectSearchParams, {
    shallow: false,
  });

  const filteredAndSorted = useMemo(() => {
    const query = q.toLowerCase().trim();
    const filtered = repos.filter((repo) => matchesQuery(repo, query));
    return [...filtered].sort((a, b) => compareRepos(a, b, sort));
  }, [repos, q, sort]);

  const totalPages = Math.ceil(filteredAndSorted.length / PROJECTS_PER_PAGE);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const paginatedRepos = filteredAndSorted.slice(
    startIndex,
    startIndex + PROJECTS_PER_PAGE
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      const query = (value || "").toLowerCase().trim();
      const nextCount = query
        ? repos.filter((r) => matchesQuery(r, query)).length
        : repos.length;
      analytics.searchProjects(value || "", nextCount);
      setParams({ q: value || null, page: 1 });
    },
    [repos, setParams]
  );

  const handleSortChange = useCallback(
    (value: SortOption) => {
      analytics.sortProjects(value);
      setParams({ sort: value, page: 1 });
    },
    [setParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      analytics.paginationClick(newPage, "projects");
      setParams({ page: newPage });
    },
    [setParams]
  );

  return {
    q,
    sort,
    currentPage,
    totalPages,
    startIndex,
    paginatedRepos,
    totalCount: filteredAndSorted.length,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
  };
}
