"use client";

import {
  Check,
  ExternalLink,
  GitBranch,
  MoreHorizontal,
  RefreshCw,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
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
  const [spinKey, setSpinKey] = useState(0);

  return (
    <div
      className={cn(
        "flex h-full select-none flex-col overflow-hidden bg-sidebar shadow-(--shadow-elevation-sm)",
        fullWidth ? "w-full min-w-0" : "w-56 shrink-0 border-border border-r"
      )}
    >
      {/* Header – VS Code: SOURCE CONTROL + (•••) + refresh */}
      <div className="flex items-center justify-between gap-1 border-border border-b px-2 py-1.5">
        <span className="flex-1 truncate px-2 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
          {t("sourceControl")}
        </span>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            aria-label={t("moreActions")}
            className="size-6 rounded p-0"
            size="icon-sm"
            title={t("moreActions")}
            type="button"
            variant="ghost"
          >
            <MoreHorizontal className="size-3.5" />
          </Button>
          <Button
            aria-label={t("syncChanges")}
            className="size-6 rounded p-0"
            onClick={() => setSpinKey((k: number) => k + 1)}
            size="icon-sm"
            title={t("syncChanges")}
            type="button"
            variant="ghost"
          >
            <RefreshCw
              className={cn(
                "size-3.5",
                spinKey > 0 && "animate-[spin_0.6s_linear_1]"
              )}
              key={spinKey}
            />
          </Button>
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
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Commit message + checkmark – VS Code: compact input, ✓ icon */}
        <div className="flex flex-col gap-1.5 border-border border-b px-2 py-2">
          <div
            className={cn(
              "flex min-h-9 min-w-0 items-center gap-2 rounded border border-input/50 px-2 py-1.5 text-[13px]",
              "cursor-not-allowed bg-muted/20 text-muted-foreground"
            )}
          >
            <span className="truncate">{t("commitMessagePlaceholder")}</span>
          </div>
          <Button
            className="h-8 w-full gap-1.5 text-[11px] disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
            disabled
            size="sm"
            type="button"
            variant="default"
          >
            <Check className="size-3.5" strokeWidth={2.5} />
            {t("commit")}
          </Button>
        </div>

        {/* CHANGES – STAGED CHANGES only shown when there are staged files (above CHANGES) */}
        <div className="flex-1 overflow-y-auto px-2 py-1">
          <CollapsibleSection defaultOpen title={`${t("changes")} (0)`}>
            <p className="py-1.5 pl-5 text-[13px] text-muted-foreground italic">
              {t("noChangesWorkingTree")}
            </p>
          </CollapsibleSection>
        </div>

        {/* Branch + View on GitHub – VS Code footer style */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-border border-t px-2 py-1.5">
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

        {/* Commit History – Outgoing / local history */}
        <div className="border-border border-t px-2 py-1">
          <CollapsibleSection defaultOpen title={t("commitHistory")}>
            <div className="max-h-32 space-y-0.5 overflow-y-auto py-1">
              {commits.length === 0 ? (
                <p className="py-1.5 pl-5 text-[13px] text-muted-foreground italic">
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
