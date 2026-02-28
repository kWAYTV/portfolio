"use client";

import type { GitHubRepo } from "@repo/github";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
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
import { useCanHover } from "@/hooks/use-can-hover";
import { cn } from "@/lib/utils";
import { LocaleLink } from "@/modules/i18n/routing";

interface FeaturedProjectsProps {
  repos: GitHubRepo[];
}

const cardClassName =
  "group -mx-2 flex min-w-0 flex-col gap-2 rounded-md px-2 py-3 transition-colors duration-200 hover:bg-muted/30 sm:flex-row sm:items-start sm:justify-between sm:gap-4";

export function FeaturedProjects({ repos }: FeaturedProjectsProps) {
  const t = useTranslations("projects");
  const canHover = useCanHover();

  if (repos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <h2 className="min-w-0 truncate font-medium text-xs tracking-tight sm:text-sm">
          {t("featured")}
        </h2>
        <LocaleLink
          className="shrink-0 whitespace-nowrap text-[10px] text-muted-foreground/50 transition-colors hover:text-muted-foreground sm:text-xs"
          href="/projects"
        >
          {t("viewAll")}
        </LocaleLink>
      </div>

      <ul className="space-y-1">
        {repos.map((repo) =>
          canHover ? (
            <li key={repo.id}>
              <HoverCard closeDelay={150} openDelay={200}>
                <HoverCardTrigger asChild>
                  <a
                    aria-label={`Open ${repo.name} on GitHub`}
                    className={cardClassName}
                    href={repo.html_url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FeaturedCardSummary repo={repo} />
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
            </li>
          ) : (
            <li key={repo.id}>
              <Popover>
                <PopoverTrigger
                  render={(props) => (
                    <button
                      {...props}
                      aria-label={`View ${repo.name} details`}
                      className={cn(
                        cardClassName,
                        "w-full cursor-pointer text-left"
                      )}
                      type="button"
                    >
                      <FeaturedCardSummary repo={repo} />
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
            </li>
          )
        )}
      </ul>
    </section>
  );
}

function FeaturedCardSummary({ repo }: { repo: GitHubRepo }) {
  return (
    <>
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
    </>
  );
}
