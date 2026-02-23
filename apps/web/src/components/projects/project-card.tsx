"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@portfolio/ui";
import { ExternalLink, GitFork, Star } from "lucide-react";
import Link from "next/link";
import { languageColors } from "@/consts/language-colors";
import { analytics } from "@/lib/analytics";
import type { GitHubRepo } from "@/lib/github";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  repo: GitHubRepo;
}

export function ProjectCard({ repo }: ProjectCardProps) {
  const languageColor = repo.language
    ? (languageColors[repo.language] ?? "bg-muted-foreground/50")
    : null;

  return (
    <HoverCard closeDelay={100} openDelay={150}>
      <HoverCardTrigger asChild>
        <Link
          className="group -mx-2 flex flex-col gap-2 rounded-md px-2 py-3 transition-colors duration-200 hover:bg-muted/30 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
          href={repo.html_url}
          onClick={() => analytics.projectClick(repo.name)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <span className="truncate font-medium text-foreground/80 text-xs leading-relaxed transition-colors duration-200 group-hover:text-foreground sm:text-sm">
              {repo.name}
            </span>
            {repo.description && (
              <p className="line-clamp-1 text-[11px] text-muted-foreground/70 leading-relaxed sm:text-xs">
                {repo.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 text-[10px] text-muted-foreground/60 tabular-nums transition-colors duration-200 group-hover:text-muted-foreground/80 sm:gap-3 sm:text-xs">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    languageColor ?? "bg-muted-foreground/30"
                  )}
                />
                <span className="hidden sm:inline">{repo.language}</span>
              </span>
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
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-80" side="top">
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-foreground text-sm leading-tight">
              {repo.name}
            </h4>
            <a
              aria-label={`Open ${repo.name} on GitHub`}
              className="text-muted-foreground/60 transition-colors hover:text-foreground"
              href={repo.html_url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink className="size-3.5" />
            </a>
          </div>
          {repo.description ? (
            <p className="text-muted-foreground text-xs leading-relaxed">
              {repo.description}
            </p>
          ) : (
            <p className="text-muted-foreground/60 text-xs italic">
              No description
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground/70">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    languageColors[repo.language] ?? "bg-muted-foreground/50"
                  )}
                />
                {repo.language}
              </span>
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
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
