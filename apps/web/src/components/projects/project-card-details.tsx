"use client";

import type { GitHubRepo } from "@portfolio/github";
import { cn } from "@portfolio/ui";
import { ExternalLink, GitFork, Star } from "lucide-react";
import { languageColors } from "@/consts/language-colors";

interface ProjectCardDetailsProps {
  onOpenClick?: () => void;
  repo: GitHubRepo;
  /** Show prominent "Open on GitHub" link for touch UX */
  showOpenLink?: boolean;
}

export function ProjectCardDetails({
  onOpenClick,
  repo,
  showOpenLink = false,
}: ProjectCardDetailsProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-foreground text-sm leading-tight">
          {repo.name}
        </h4>
        <a
          aria-label={`Open ${repo.name} on GitHub`}
          className="shrink-0 rounded-md p-1 text-muted-foreground/60 transition-colors hover:text-foreground"
          href={repo.html_url}
          onClick={onOpenClick}
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
      {showOpenLink && (
        <a
          className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-md border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
          href={repo.html_url}
          onClick={onOpenClick}
          rel="noopener noreferrer"
          target="_blank"
        >
          <ExternalLink className="size-3.5" />
          Open on GitHub
        </a>
      )}
    </div>
  );
}
