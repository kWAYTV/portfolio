"use client";

import { analytics } from "@repo/analytics";
import type { GitHubRepo } from "@repo/github";
import { useTranslations } from "next-intl";
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
import { LocaleLink } from "@/modules/i18n/routing";
import { ProjectCardDetails } from "@/modules/projects/components/project-card-details";

interface FeaturedProjectsProps {
  repos: GitHubRepo[];
}

const rowClassName =
  "group flex min-w-0 w-full items-baseline justify-between gap-4 border-b border-white/10 py-3 text-left transition-colors duration-200 last:border-b-0 hover:text-[var(--color-accent-signal)]";

export function FeaturedProjects({ repos }: FeaturedProjectsProps) {
  const t = useTranslations("projects");
  const canHover = useCanHover();

  if (repos.length === 0) {
    return null;
  }

  return (
    <section className="band-graphite -mx-4 px-4 py-6 sm:-mx-6 sm:px-6 sm:py-7">
      <div className="mb-4 flex min-w-0 items-baseline justify-between gap-3">
        <h2 className="font-mono-label text-[var(--color-graphite-muted)]">
          {t("featured")}
        </h2>
        <LocaleLink
          className="link-accent shrink-0 font-mono text-[10px] text-[var(--color-graphite-muted)] tracking-wide sm:text-xs"
          href="/projects"
        >
          {t("viewAll")}
        </LocaleLink>
      </div>

      <ul>
        {repos.map((repo) =>
          canHover ? (
            <li key={repo.id}>
              <HoverCard closeDelay={150} openDelay={200}>
                <HoverCardTrigger asChild nativeButton={false}>
                  <a
                    aria-label={`Open ${repo.name} on GitHub`}
                    className={rowClassName}
                    href={repo.html_url}
                    onClick={() => analytics.projectClick(repo.name)}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FeaturedRowSummary repo={repo} />
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
            </li>
          ) : (
            <li key={repo.id}>
              <Popover>
                <PopoverTrigger
                  render={(props) => (
                    <button
                      {...props}
                      aria-label={`View ${repo.name} details`}
                      className={cn(rowClassName, "cursor-pointer")}
                      onClick={() => analytics.projectClick(repo.name)}
                      type="button"
                    >
                      <FeaturedRowSummary repo={repo} />
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
            </li>
          )
        )}
      </ul>
    </section>
  );
}

function FeaturedRowSummary({ repo }: { repo: GitHubRepo }) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <span className="block truncate font-display font-medium text-[var(--color-graphite-ink)] text-sm tracking-tight sm:text-base">
          {repo.name}
        </span>
        {repo.description ? (
          <p className="mt-1 line-clamp-1 text-[var(--color-graphite-muted)] text-xs">
            {repo.description}
          </p>
        ) : null}
      </div>
      <span className="shrink-0 font-mono text-[10px] text-[var(--color-graphite-muted)] tabular-nums sm:text-xs">
        ★ {repo.stargazers_count}
      </span>
    </>
  );
}
