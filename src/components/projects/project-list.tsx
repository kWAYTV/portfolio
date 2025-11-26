"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import type { SortOption } from "@/components/projects/project-filters";
import { ProjectFilters } from "@/components/projects/project-filters";
import { ProjectPagination } from "@/components/projects/project-pagination";
import type { GitHubRepo } from "@/lib/github";

const ITEMS_PER_PAGE = 5;

type ProjectListProps = {
  repos: GitHubRepo[];
};

export function ProjectList({ repos }: ProjectListProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("stars");
  const [page, setPage] = useState(1);

  const filteredAndSorted = useMemo(() => {
    const query = search.toLowerCase().trim();

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

    return filtered.sort((a, b) => {
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
  }, [repos, search, sort]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRepos = filteredAndSorted.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSort(value);
    setPage(1);
  };

  return (
    <div className="space-y-3">
      <ProjectFilters
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        search={search}
        sort={sort}
      />

      <p className="text-[11px] text-muted-foreground/40">
        {filteredAndSorted.length} project
        {filteredAndSorted.length !== 1 && "s"}
        {search && ` matching "${search}"`}
      </p>

      <div className="min-h-52">
        {paginatedRepos.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground/40 text-xs sm:text-sm">
            No projects found
          </p>
        ) : (
          <div className="space-y-0.5">
            {paginatedRepos.map((repo) => (
              <ProjectCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </div>

      <ProjectPagination
        currentPage={currentPage}
        onPageChange={setPage}
        totalPages={totalPages}
      />
    </div>
  );
}
