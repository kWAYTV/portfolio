"use client";

import { ExternalLink, GitFork, Star } from "lucide-react";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { languageColors } from "@/consts/language-colors";
import type { GitHubRepo } from "@/lib/github";
import { cn } from "@/lib/utils";

type FeaturedProjectsProps = {
  repos: GitHubRepo[];
};

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

      <ul className="space-y-0.5">
        {repos.map((repo) => (
          <li key={repo.id}>
            <HoverCard closeDelay={100} openDelay={150}>
              <HoverCardTrigger asChild>
                <a
                  className="group flex items-center justify-between gap-3 py-1.5 text-muted-foreground/70 transition-colors hover:text-foreground"
                  href={repo.html_url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="truncate font-medium text-foreground/80 text-xs transition-colors group-hover:text-foreground group-hover:underline sm:text-sm">
                    {repo.name}
                  </span>
                  <ExternalLink className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
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
