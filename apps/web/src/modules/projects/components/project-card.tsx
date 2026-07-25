"use client";

import { analytics } from "@repo/analytics";
import type { GitHubRepo } from "@repo/github";
import { GitFork, Star } from "lucide-react";
import { memo } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCanHover } from "@/hooks/use-can-hover";
import { cn } from "@/lib/utils";
import { ProjectCardDetails } from "@/modules/projects/components/project-card-details";
import { languageColors } from "@/modules/projects/consts/language-colors";

interface ProjectCardProps {
  repo: GitHubRepo;
}

const cardClassName =
  "group row-hairline flex min-h-16 flex-col gap-2 overflow-hidden py-3.5 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between sm:gap-4";

function ProjectCardInner({ repo }: ProjectCardProps) {
  const languageColor = repo.language
    ? (languageColors[repo.language] ?? "bg-muted-foreground/50")
    : null;
  const canHover = useCanHover();

  if (canHover) {
    return (
      <HoverCard closeDelay={150} openDelay={200}>
        <HoverCardTrigger asChild nativeButton={false}>
          <a
            className={cn(cardClassName, "w-full cursor-pointer text-left")}
            href={repo.html_url}
            onClick={() => analytics.projectClick(repo.name)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ProjectCardSummary languageColor={languageColor} repo={repo} />
          </a>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-80 overflow-hidden rounded-[var(--radius-panel)] border border-border bg-popover p-0 shadow-sm"
          side="top"
          sideOffset={8}
        >
          <ProjectCardDetails repo={repo} />
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <Popover>
      <PopoverTrigger
        render={(props) => (
          <button
            {...props}
            aria-label={`View ${repo.name} details`}
            className={cn(cardClassName, "w-full cursor-pointer text-left")}
            onClick={() => analytics.projectClick(repo.name)}
            type="button"
          >
            <ProjectCardSummary languageColor={languageColor} repo={repo} />
          </button>
        )}
      />
      <PopoverContent
        align="start"
        className="w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-panel)] border border-border bg-popover p-0 shadow-sm"
        side="top"
      >
        <ProjectCardDetails repo={repo} showOpenLink />
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
        <span className="truncate font-display font-medium text-foreground text-sm tracking-tight transition-colors duration-200 group-hover:text-[var(--color-accent-signal)] sm:text-base">
          {repo.name}
        </span>
        {repo.description && (
          <p className="line-clamp-1 text-muted-foreground text-xs leading-relaxed">
            {repo.description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 font-mono text-[10px] text-muted-foreground tabular-nums sm:gap-3 sm:text-xs">
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
