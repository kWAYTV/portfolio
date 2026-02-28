"use client";

import { GitBranch, Github } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Commit } from "@/consts/ide-constants";
import { REPO_URL } from "@/consts/ide-constants";
import { cn, formatRelativeDate } from "@/lib/utils";

interface CommitHistoryItemProps {
  commit: Commit;
}

export function CommitHistoryItem({ commit }: CommitHistoryItemProps) {
  const t = useTranslations("ide");
  const locale = useLocale();
  const dateRelative = formatRelativeDate(commit.date, locale);
  const shaShort = commit.sha.slice(0, 7);

  return (
    <HoverCard closeDelay={150} openDelay={200}>
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
            {shaShort} · {commit.author} · {dateRelative}
          </p>
        </a>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        className="ide-dropdown w-80 overflow-hidden rounded-md border border-border bg-popover p-0 shadow-lg ring-1 ring-border/50"
        side="right"
        sideOffset={8}
      >
        <div className="flex flex-col">
          {/* Meta header */}
          <div className="border-border border-b px-3 py-2">
            <p className="text-[11px] text-muted-foreground">
              {commit.author} · {dateRelative}
            </p>
            <p className="mt-1 font-medium text-[13px] text-popover-foreground leading-snug">
              {commit.message}
            </p>
          </div>
          {/* Description */}
          {commit.description && (
            <div className="border-border border-b px-3 py-2">
              <p className="whitespace-pre-wrap border-border border-l-2 pl-2.5 text-[12px] text-muted-foreground leading-relaxed">
                {commit.description}
              </p>
            </div>
          )}
          {/* Stats + branches */}
          <div className="flex flex-col gap-2 px-3 py-2">
            {commit.filesChanged != null && commit.insertions != null && (
              <p className="text-[11px] text-muted-foreground">
                {commit.filesChanged} files changed, {commit.insertions}{" "}
                insertions(+)
              </p>
            )}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded border border-border/60 bg-muted/30 px-1.5 py-0.5 font-medium text-[10px] text-primary">
                <GitBranch className="size-3" />
                main
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-border/60 bg-muted/20 px-1.5 py-0.5 font-medium text-[10px] text-muted-foreground">
                <GitBranch className="size-3" />
                origin/main
              </span>
            </div>
          </div>
          {/* CTA */}
          <a
            className="flex items-center justify-center gap-2 border-border border-t bg-muted/20 px-3 py-2.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
            href={`${REPO_URL}/commit/${commit.sha}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Github className="size-3.5" />
            {shaShort} · {t("viewOnGitHub")}
          </a>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
