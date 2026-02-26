"use client";

import { analytics } from "@portfolio/analytics";
import type { GitHubRepo } from "@portfolio/github";
import {
  cn,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@portfolio/ui";
import { GitFork, Star } from "lucide-react";
import Link from "next/link";
import { memo, useCallback } from "react";
import { languageColors } from "@/consts/language-colors";
import { ProjectCardDetails } from "./project-card-details";

interface ProjectCardProps {
  canHover: boolean;
  repo: GitHubRepo;
}

const cardClassName =
  "group -mx-2 flex flex-col gap-2 rounded-md px-2 py-3 transition-colors duration-200 hover:bg-muted/30 sm:flex-row sm:items-start sm:justify-between sm:gap-4";

function ProjectCardInner({ canHover, repo }: ProjectCardProps) {
  const languageColor = repo.language
    ? (languageColors[repo.language] ?? "bg-muted-foreground/50")
    : null;

  const handleAnalyticsClick = useCallback(() => {
    analytics.projectClick(repo.name);
  }, [repo.name]);

  if (canHover) {
    return (
      <HoverCard closeDelay={100} openDelay={150}>
        <HoverCardTrigger asChild>
          <Link
            className={cardClassName}
            href={repo.html_url}
            onClick={handleAnalyticsClick}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ProjectCardSummary languageColor={languageColor} repo={repo} />
          </Link>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-80" side="top">
          <ProjectCardDetails repo={repo} />
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(cardClassName, "w-full cursor-pointer text-left")}
          type="button"
        >
          <ProjectCardSummary languageColor={languageColor} repo={repo} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(320px,calc(100vw-2rem))]"
        side="top"
      >
        <ProjectCardDetails
          onOpenClick={handleAnalyticsClick}
          repo={repo}
          showOpenLink
        />
      </PopoverContent>
    </Popover>
  );
}

export const ProjectCard = memo(ProjectCardInner);

function ProjectCardSummary({
  repo,
  languageColor,
}: {
  repo: GitHubRepo;
  languageColor: string | null;
}) {
  return (
    <>
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
    </>
  );
}
