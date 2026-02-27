"use client";

import type { GitHubRepo } from "@portfolio/github";
import { useTranslations } from "next-intl";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { memo, useCallback, useMemo } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import {
  ProjectFilters,
  type SortOption,
  sortOptions,
} from "@/components/projects/project-filters";
import { Pagination } from "@/components/shared/pagination";
import { useCanHover } from "@/hooks/use-can-hover";

const ITEMS_PER_PAGE = 5;

const projectSearchParams = {
  q: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(sortOptions).withDefault("updated"),
  page: parseAsInteger.withDefault(1),
};

interface ProjectListProps {
  repos: GitHubRepo[];
}

export const ProjectList = memo(function ProjectList({
  repos,
}: ProjectListProps) {
  const t = useTranslations("projects");
  const canHover = useCanHover();
  const [{ q, sort, page }, setParams] = useQueryStates(projectSearchParams, {
    shallow: true,
  });

  const filteredAndSorted = useMemo(() => {
    const query = q.toLowerCase().trim();

    const filtered = repos.filter((repo) => {
      if (!query) {
        return true;
      }
      return (
        repo.name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.language?.toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "stars":
          return b.stargazers_count - a.stargazers_count;
        case "updated":
          return (
            new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
          );
        case "created":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [repos, q, sort]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRepos = filteredAndSorted.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setParams({ q: value || null, page: 1 });
    },
    [setParams]
  );

  const handleSortChange = useCallback(
    (value: SortOption) => {
      setParams({ sort: value, page: 1 });
    },
    [setParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setParams({ page: newPage });
    },
    [setParams]
  );

  return (
    <div className="space-y-3">
      <ProjectFilters
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        search={q}
        sort={sort}
      />

      <p className="text-[11px] text-muted-foreground/60">
        {t("projectCount", { count: filteredAndSorted.length })}
        {q && ` ${t("matching", { query: q })}`}
      </p>

      <div className="space-y-1">
        {paginatedRepos.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground/60 text-xs sm:text-sm">
            {t("noProjects")}
          </p>
        ) : (
          paginatedRepos.map((repo) => (
            <ProjectCard canHover={canHover} key={repo.id} repo={repo} />
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
});
