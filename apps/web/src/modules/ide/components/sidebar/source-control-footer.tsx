"use client";

import { analytics } from "@repo/analytics";
import { ExternalLink, GitBranch } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { REPO_URL } from "@/modules/ide/consts/ide-constants";

export function SourceControlFooter() {
  const t = useTranslations("ide");

  return (
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
        onClick={() => analytics.viewOnGitHub("source-control-footer")}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ExternalLink className="size-3" />
        {t("viewOnGitHub")}
      </a>
    </div>
  );
}
