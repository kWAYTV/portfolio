"use client";

import { type MockCommit, REPO_URL } from "@/consts/ide-constants";
import { cn } from "@/lib/utils";

interface CommitHistoryItemProps {
  commit: MockCommit;
}

export function CommitHistoryItem({ commit }: CommitHistoryItemProps) {
  return (
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
  );
}
