"use client";

import type { GitHubRepo } from "@repo/github";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [{ q, sort, page }, setParams] = useQueryStates(projectSearchParams, {
    shallow: false,
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
        {q ? ` ${t("matching", { query: q })}` : ""}
      </p>

      <div className="space-y-1">
        {paginatedRepos.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground/60 text-xs sm:text-sm">
            {t("noProjects")}
          </p>
        ) : (
          paginatedRepos.map((repo) => (
            <ProjectCard key={repo.id} repo={repo} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="sticky bottom-0 z-10 -mx-2 flex shrink-0 items-center justify-center gap-3 border-border/50 border-t bg-background/95 px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] backdrop-blur-[2px] sm:-mx-3 sm:gap-4 sm:px-6 dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
          <button
            className="inline-flex h-9 min-w-18 touch-manipulation items-center justify-center gap-1 px-3 text-muted-foreground/70 text-xs transition-colors hover:text-foreground hover:underline hover:decoration-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            type="button"
          >
            <ChevronLeft className="size-3.5" />
            {t("prev")}
          </button>
          <span className="min-w-12 text-center text-muted-foreground/60 text-xs tabular-nums">
            {currentPage} / {totalPages}
          </span>
          <button
            className="inline-flex h-9 min-w-18 touch-manipulation items-center justify-center gap-1 px-3 text-muted-foreground/70 text-xs transition-colors hover:text-foreground hover:underline hover:decoration-foreground/50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            type="button"
          >
            {t("next")}
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
});
