"use client";

import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from "@portfolio/ui";
import { ExternalLink, GitBranch, GitCommit } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";

const PORTFOLIO_REPO_URL = "https://github.com/kWAYTV/portfolio";

export const SourceControlView = memo(function SourceControlView() {
  const t = useTranslations("ide");

  return (
    <div className="flex h-full w-56 shrink-0 select-none flex-col overflow-hidden border-border border-r bg-sidebar shadow-[var(--shadow-elevation-sm)]">
      <div className="flex items-center justify-between gap-1 px-2 py-2">
        <span className="flex-1 px-2 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
          {t("sourceControl")}
        </span>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Commit message area - VS Code style */}
        <div className="flex flex-col gap-2 border-border border-b px-2 py-2">
          <div className="flex items-center gap-1.5 rounded px-2 py-1.5 text-[13px] text-muted-foreground ring-1 ring-inset ring-border/50">
            <GitCommit className="size-4 shrink-0 opacity-60" />
            <span className="truncate">{t("commitMessagePlaceholder")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              className="h-7 flex-1 text-[11px]"
              disabled
              size="sm"
              variant="secondary"
            >
              <GitCommit className="size-3.5" />
              {t("commit")}
            </Button>
          </div>
        </div>

        {/* Changes section */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <button
            className="flex w-full items-center gap-1 py-[6px] pl-2 text-left text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
            type="button"
          >
            <GitBranch className="size-4 shrink-0 opacity-70" />
            <span className="truncate font-medium text-[11px]">main</span>
          </button>

          <div className="flex-1 overflow-y-auto px-2 pb-2">
            <div className="rounded-md border border-border/60 bg-muted/30 px-2 py-3 text-center">
              <p className="text-[11px] text-muted-foreground">
                {t("noChanges")}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground/80">
                {t("noChangesHint")}
              </p>
            </div>
          </div>

          {/* Creative "Open repo" - styled as VS Code link */}
          <div className="border-border border-t px-2 py-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-md px-2 py-2",
                    "text-[11px] text-muted-foreground transition-colors",
                    "hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                  href={PORTFOLIO_REPO_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <ExternalLink className="size-3.5" />
                  {t("viewOnGitHub")}
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">
                {t("openRepo")}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
});
