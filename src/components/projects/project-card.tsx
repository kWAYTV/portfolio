"use client";

import { GitFork, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { languageColors } from "@/consts/language-colors";
import { analytics } from "@/lib/analytics";
import type { GitHubRepo } from "@/lib/github";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  repo: GitHubRepo;
};

export function ProjectCard({ repo }: ProjectCardProps) {
  const languageColor = repo.language
    ? languageColors[repo.language] || "bg-muted-foreground"
    : null;

  return (
    <Link
      className="group -mx-2 flex flex-col gap-2 rounded-md px-2 py-2.5 transition-all duration-200 hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
      href={repo.html_url}
      onClick={() => analytics.projectClick(repo.name)}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="truncate text-foreground/80 text-xs transition-colors duration-200 group-hover:text-foreground sm:text-sm">
              {repo.name}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-64" side="bottom">
            {repo.description || (
              <span className="text-muted-foreground italic">
                No description
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground/70 tabular-nums transition-colors duration-200 group-hover:text-muted-foreground sm:gap-3 sm:text-xs">
        {repo.language && (
          <Badge
            className="inline-flex gap-1.5 border-transparent bg-muted/40 px-1.5 py-0 text-[10px] text-muted-foreground"
            variant="outline"
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                languageColor ?? "bg-muted-foreground/30"
              )}
            />
            <span className="whitespace-nowrap">{repo.language}</span>
          </Badge>
        )}
        <span className="inline-flex items-center gap-0.5">
          <Star className="size-3" />
          {repo.stargazers_count}
        </span>
        <span className="inline-flex items-center gap-0.5">
          <GitFork className="size-3" />
          {repo.forks_count}
        </span>
      </div>
    </Link>
  );
}
