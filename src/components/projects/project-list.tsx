"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { GitHubRepo } from "@/lib/github";

type SortOption = "stars" | "updated" | "name" | "created";

type ProjectListProps = {
  repos: GitHubRepo[];
};

export function ProjectList({ repos }: ProjectListProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("stars");

  const filteredAndSorted = useMemo(() => {
    const query = search.toLowerCase().trim();

    const filtered = repos.filter((repo) => {
      if (!query) {
        return true;
      }

      return (
        repo.name.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.language?.toLowerCase().includes(query) ||
        repo.topics.some((topic) => topic.toLowerCase().includes(query))
      );
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
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
  }, [repos, search, sortBy]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-3.5 text-muted-foreground" />
          <Input
            className="h-8 pl-8 text-xs sm:h-9 sm:text-sm"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            type="search"
            value={search}
          />
        </div>
        <Select
          className="h-8 w-full text-xs sm:h-9 sm:w-36 sm:text-sm"
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          value={sortBy}
        >
          <option value="stars">Most stars</option>
          <option value="updated">Recently updated</option>
          <option value="created">Recently created</option>
          <option value="name">Name</option>
        </Select>
      </div>

      <div className="text-muted-foreground text-xs">
        {filteredAndSorted.length} project
        {filteredAndSorted.length !== 1 && "s"}
        {search && ` matching "${search}"`}
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground text-sm">
          No projects found matching your search.
        </div>
      ) : (
        <div className="grid gap-2 sm:gap-3">
          {filteredAndSorted.map((repo, index) => (
            <BlurFade delay={index * 0.03} key={repo.id}>
              <ProjectCard repo={repo} />
            </BlurFade>
          ))}
        </div>
      )}
    </div>
  );
}
