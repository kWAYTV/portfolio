"use client";

import { Search } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useMemo } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import type { GitHubRepo } from "@/lib/github";
import { type SortOption, sortOptions } from "@/lib/search-params";

const ITEMS_PER_PAGE = 10;

type ProjectListProps = {
  repos: GitHubRepo[];
};

export function ProjectList({ repos }: ProjectListProps) {
  const [params, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      q: parseAsString.withDefault(""),
      sort: parseAsString.withDefault("stars"),
    },
    { shallow: true }
  );

  const { page, q, sort } = params;

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

    return filtered.sort((a, b) => {
      switch (sort as SortOption) {
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

  const createPageUrl = (pageNum: number) => {
    const searchParams = new URLSearchParams();
    if (pageNum > 1) {
      searchParams.set("page", String(pageNum));
    }
    if (q) {
      searchParams.set("q", q);
    }
    if (sort !== "stars") {
      searchParams.set("sort", sort);
    }
    const queryString = searchParams.toString();
    return `/projects${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-2.5 size-3 text-muted-foreground" />
          <Input
            className="h-8 pl-8 text-xs sm:text-sm"
            onChange={(e) => setParams({ q: e.target.value || null, page: 1 })}
            placeholder="Search projects..."
            type="search"
            value={q}
          />
        </div>
        <Select
          className="h-8 w-24 text-xs sm:w-28 sm:text-sm"
          onChange={(e) =>
            setParams({ sort: e.target.value as SortOption, page: 1 })
          }
          value={sort}
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option === "stars" && "Stars"}
              {option === "updated" && "Updated"}
              {option === "created" && "Created"}
              {option === "name" && "Name"}
            </option>
          ))}
        </Select>
      </div>

      <p className="text-muted-foreground/60 text-xs">
        {filteredAndSorted.length} project
        {filteredAndSorted.length !== 1 && "s"}
        {q && ` matching "${q}"`}
      </p>

      {paginatedRepos.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground/60 text-xs sm:text-sm">
          No projects found.
        </p>
      ) : (
        <div className="divide-y divide-border/40">
          {paginatedRepos.map((repo) => (
            <ProjectCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="pt-2">
          <PaginationContent className="gap-2">
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={currentPage <= 1}
                className={`h-8 text-xs sm:text-sm ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
                href={createPageUrl(currentPage - 1)}
              />
            </PaginationItem>

            <PaginationItem>
              <span className="px-3 text-muted-foreground text-xs sm:text-sm">
                {currentPage} / {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                aria-disabled={currentPage >= totalPages}
                className={`h-8 text-xs sm:text-sm ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                href={createPageUrl(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
