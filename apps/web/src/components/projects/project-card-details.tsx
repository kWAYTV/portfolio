"use client";

import type { GitHubRepo } from "@repo/github";
import { ExternalLink, GitFork, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { languageColors } from "@/consts/language-colors";
import { cn } from "@/lib/utils";

interface ProjectCardDetailsProps {
  repo: GitHubRepo;
  showOpenLink?: boolean;
}

function ProjectCardDetailsInner({
  repo,
  showOpenLink = false,
}: ProjectCardDetailsProps) {
  const t = useTranslations("projects");
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-border border-b px-3 py-2.5">
        <h4 className="min-w-0 flex-1 font-medium text-foreground text-sm leading-tight">
          {repo.name}
        </h4>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              aria-label={t("openRepoOnGitHub", { name: repo.name })}
              className="shrink-0 rounded p-1 text-muted-foreground/60 transition-colors hover:bg-muted/50 hover:text-foreground"
              href={repo.html_url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink className="size-3.5" />
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("openRepoOnGitHub", { name: repo.name })}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      {/* Description */}
      <div className="border-border border-b px-3 py-2">
        {repo.description ? (
          <p className="text-muted-foreground text-xs leading-relaxed">
            {repo.description}
          </p>
        ) : (
          <p className="text-muted-foreground/60 text-xs italic">
            {t("noDescription")}
          </p>
        )}
      </div>
      {/* Stats */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2 text-[11px] text-muted-foreground",
          showOpenLink && "border-border border-b"
        )}
      >
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span
              className={cn(
                "size-2 shrink-0 rounded-full",
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
          className="flex items-center justify-center gap-2 border-border border-t bg-muted/20 px-3 py-2.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
          href={repo.html_url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <ExternalLink className="size-3.5" />
          {t("openOnGitHub")}
        </a>
      )}
    </div>
  );
}

export const ProjectCardDetails = memo(ProjectCardDetailsInner);
