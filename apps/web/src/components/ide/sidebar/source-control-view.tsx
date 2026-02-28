"use client";

import { ExternalLink, GitBranch, GitCommit, RefreshCw, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { CollapsibleSection } from "@/components/ide/sidebar/collapsible-section";
import { CommitHistoryItem } from "@/components/ide/sidebar/commit-history-item";
import { Button } from "@/components/ui/button";
import type { Commit } from "@/consts/ide-constants";
import { REPO_URL } from "@/consts/ide-constants";
import { cn } from "@/lib/utils";

interface SourceControlViewProps {
  commits?: Commit[];
  fullWidth?: boolean;
  onClose?: () => void;
}

export function SourceControlView({
  commits = [],
  fullWidth = false,
  onClose,
}: SourceControlViewProps) {
  const t = useTranslations("ide");

  return (
    <div
      className={cn(
        "flex h-full select-none flex-col overflow-hidden bg-sidebar shadow-(--shadow-elevation-sm)",
        fullWidth ? "w-full min-w-0" : "w-56 shrink-0 border-border border-r"
      )}
    >
      {/* Header - matches VS Code */}
      <div className="flex items-center justify-between gap-1 border-border border-b px-2 py-2">
        <span className="flex-1 px-2 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
          {t("sourceControl")}
        </span>
        <div className="flex items-center gap-0.5">
          {onClose && (
            <Button
              aria-label={t("close")}
              className="size-6 rounded p-0"
              onClick={onClose}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          )}
          <Button
            aria-label={t("syncChanges")}
            className="size-6 rounded p-0"
            size="icon-sm"
            title={t("syncChanges")}
            type="button"
            variant="ghost"
          >
            <RefreshCw className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Commit message + button - VS Code style */}
        <div className="flex flex-col gap-2 border-border border-b px-2 py-2">
          <div
            className={cn(
              "flex min-h-[72px] min-w-0 items-start gap-1.5 rounded px-2 py-2 text-[13px] ring-1 ring-border/50 ring-inset",
              "cursor-not-allowed bg-muted/30 text-muted-foreground/80"
            )}
          >
            <GitCommit
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-muted-foreground/60"
            />
            <span className="truncate">{t("commitMessagePlaceholder")}</span>
          </div>
          <Button
            className="h-7 w-full text-[11px]"
            disabled
            size="sm"
            variant="secondary"
          >
            <GitCommit className="size-3.5" />
            {t("commit")}
          </Button>
        </div>

        {/* Scrollable sections - CHANGES */}
        <div className="flex-1 overflow-y-auto px-2 py-1">
          <CollapsibleSection defaultOpen title={t("changes")}>
            <div className="rounded-md border border-border/60 bg-muted/20 px-2 py-2.5">
              <p className="text-[11px] text-muted-foreground">
                {t("noChanges")}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                {t("noChangesHint")}
              </p>
            </div>
          </CollapsibleSection>
        </div>

        {/* Branch + View on GitHub */}
        <div className="flex items-center justify-between gap-2 border-border border-t px-2 py-1.5">
          <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
            <GitBranch
              aria-hidden
              className="size-3.5 shrink-0 text-muted-foreground/70"
            />
            <span className="truncate font-medium">main</span>
          </div>
          <a
            className={cn(
              "flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[10px] transition-colors",
              "text-muted-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
            href={REPO_URL}
            rel="noopener noreferrer"
            target="_blank"
            title={t("openRepo")}
          >
            <ExternalLink className="size-3" />
            {t("viewOnGitHub")}
          </a>
        </div>

        {/* Commit History */}
        <div className="border-border border-t px-2 py-1">
          <CollapsibleSection defaultOpen title={t("commitHistory")}>
            <div className="max-h-32 space-y-0.5 overflow-y-auto py-1">
              {commits.length === 0 ? (
                <p className="px-2 py-1.5 text-[11px] text-muted-foreground">
                  {t("noChanges")}
                </p>
              ) : (
                commits.map((commit) => (
                  <CommitHistoryItem commit={commit} key={commit.sha} />
                ))
              )}
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
