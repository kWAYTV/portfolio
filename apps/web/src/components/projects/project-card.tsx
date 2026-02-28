"use client";

import type { GitHubRepo } from "@repo/github";
import { GitFork, Star } from "lucide-react";
import { memo } from "react";
import { ProjectCardDetails } from "@/components/projects/project-card-details";
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
import { languageColors } from "@/consts/language-colors";
import { useCanHover } from "@/hooks/use-can-hover";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  repo: GitHubRepo;
}

const cardClassName =
  "group -mx-2 flex h-16 flex-col gap-2 overflow-hidden rounded-md px-2 py-3 transition-colors duration-200 hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between sm:gap-4";

function ProjectCardInner({ repo }: ProjectCardProps) {
  const languageColor = repo.language
    ? (languageColors[repo.language] ?? "bg-muted-foreground/50")
    : null;
  const canHover = useCanHover();

  if (canHover) {
    return (
      <HoverCard closeDelay={150} openDelay={200}>
        <HoverCardTrigger asChild>
          <a
            className={cn(cardClassName, "w-full cursor-pointer text-left")}
            href={repo.html_url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ProjectCardSummary languageColor={languageColor} repo={repo} />
          </a>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-80 overflow-hidden rounded-md border border-border bg-popover p-0 shadow-lg ring-1 ring-border/50"
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
            type="button"
          >
            <ProjectCardSummary languageColor={languageColor} repo={repo} />
          </button>
        )}
      />
      <PopoverContent
        align="start"
        className="w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-md border border-border bg-popover p-0 shadow-lg ring-1 ring-border/50"
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
