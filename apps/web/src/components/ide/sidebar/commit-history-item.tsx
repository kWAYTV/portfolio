"use client";

import { GitBranch, Github } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { type MockCommit, REPO_URL } from "@/consts/ide-constants";
import { cn } from "@/lib/utils";

interface CommitHistoryItemProps {
  commit: MockCommit;
}

export function CommitHistoryItem({ commit }: CommitHistoryItemProps) {
  const t = useTranslations("ide");

  return (
    <HoverCard closeDelay={100} openDelay={150}>
      <HoverCardTrigger asChild>
        <a
          className={cn(
            "block rounded px-2 py-1.5 text-left transition-colors",
            "hover:bg-sidebar-accent/50"
          )}
          href={`${REPO_URL}/commit/${commit.sha}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <p className="truncate text-[11px] text-sidebar-foreground">
            {commit.message}
          </p>
          <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
            {commit.sha} · {commit.author} · {commit.date}
          </p>
        </a>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        className="ide-dropdown w-72 rounded-sm border border-border bg-popover p-3"
        side="right"
      >
        <div className="space-y-2.5">
          <p className="text-[11px] text-muted-foreground">
            {commit.author} · {commit.date}
          </p>
          <p className="text-[13px] text-popover-foreground leading-snug">
            {commit.message}
          </p>
          {commit.filesChanged != null && commit.insertions != null && (
            <p className="text-[11px] text-muted-foreground">
              {commit.filesChanged} files changed, {commit.insertions}{" "}
              insertions(+)
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-medium text-[10px] text-primary">
              <GitBranch className="size-3" />
              main
            </span>
            <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-medium text-[10px] text-muted-foreground">
              <GitBranch className="size-3" />
              origin/main
            </span>
          </div>
          <a
            className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-2 text-[11px] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            href={`${REPO_URL}/commit/${commit.sha}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Github className="size-3.5" />
            {commit.sha} · {t("viewOnGitHub")}
          </a>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
