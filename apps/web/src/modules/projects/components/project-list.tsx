"use client";

import type { GitHubRepo } from "@repo/github";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { ProjectCard } from "@/modules/projects/components/project-card";
import { ProjectFilters } from "@/modules/projects/components/project-filters";
import { ProjectListPagination } from "@/modules/projects/components/project-list-pagination";
import {
  PROJECTS_PER_PAGE,
  useProjectsQuery,
} from "@/modules/projects/hooks/use-projects-query";

interface ProjectListProps {
  repos: GitHubRepo[];
}

export const ProjectList = memo(function ProjectList({
  repos,
}: ProjectListProps) {
  const t = useTranslations("projects");
  const {
    q,
    sort,
    currentPage,
    totalPages,
    startIndex,
    paginatedRepos,
    totalCount,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
  } = useProjectsQuery(repos);

  return (
    <div className="space-y-3">
      <ProjectFilters
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        search={q}
        sort={sort}
      />

      <p className="text-[11px] text-muted-foreground/60">
        {t("projectCount", { count: totalCount })}
        {q ? ` ${t("matching", { query: q })}` : ""}
      </p>

      <div className="space-y-1">
        {paginatedRepos.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground/60 text-xs sm:text-sm">
            {t("noProjects")}
          </p>
        ) : (
          Array.from({ length: PROJECTS_PER_PAGE }).map((_, i) =>
            paginatedRepos[i] ? (
              <ProjectCard
                key={paginatedRepos[i].id}
                repo={paginatedRepos[i]}
              />
            ) : (
              <div
                aria-hidden
                className="h-16 shrink-0"
                key={`empty-${startIndex + i}`}
              />
            )
          )
        )}
      </div>

      {totalPages > 1 && (
        <ProjectListPagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      )}
    </div>
  );
});
