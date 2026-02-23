"use client";

import type { GitHubRepo } from "@portfolio/github";
import {
  cn,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@portfolio/ui";
import { ExternalLink, GitFork, Star } from "lucide-react";
import { languageColors } from "@/consts/language-colors";
import { Link } from "@/i18n/navigation";

interface FeaturedProjectsProps {
  repos: GitHubRepo[];
}

export function FeaturedProjects({ repos }: FeaturedProjectsProps) {
  if (repos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-xs tracking-tight sm:text-sm">
          Featured
        </h2>
        <Link
          className="text-[10px] text-muted-foreground/50 transition-colors hover:text-muted-foreground sm:text-xs"
          href="/projects"
        >
          View all →
        </Link>
      </div>

      <ul className="space-y-1">
        {repos.map((repo) => (
          <li key={repo.id}>
            <HoverCard closeDelay={100} openDelay={150}>
              <HoverCardTrigger asChild>
                <a
                  className="group -mx-2 flex flex-col gap-2 rounded-md px-2 py-3 transition-colors duration-200 hover:bg-muted/30 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                  href={repo.html_url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <span className="truncate font-medium text-foreground/80 text-xs leading-relaxed transition-colors duration-200 group-hover:text-foreground group-hover:underline sm:text-sm">
                      {repo.name}
                    </span>
                    {repo.description && (
                      <p className="line-clamp-1 text-[11px] text-muted-foreground/70 leading-relaxed sm:text-xs">
                        {repo.description}
                      </p>
                    )}
                  </div>
                  <ExternalLink className="size-3 shrink-0 text-muted-foreground/60 transition-colors duration-200 group-hover:text-muted-foreground/80" />
                </a>
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
                  {repo.description && (
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground/70">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "size-2 rounded-full",
                            languageColors[repo.language] ??
                              "bg-muted-foreground/50"
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
          </li>
        ))}
      </ul>
    </section>
  );
}
