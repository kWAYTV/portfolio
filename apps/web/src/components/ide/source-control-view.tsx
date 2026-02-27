"use client";

import type { GitCommitItem } from "@/lib/github";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@portfolio/ui";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  GitBranch,
  GitCommit,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";

const PORTFOLIO_REPO_URL = "https://github.com/kWAYTV/portfolio";

const MOCK_COMMITS: GitCommitItem[] = [
  { sha: "a1b2c3d", message: "feat(ide): add VS Code-style source control panel", author: "kWAYTV", date: "2 hours ago" },
  { sha: "e4f5g6h", message: "chore: update dependencies", author: "kWAYTV", date: "1 day ago" },
  { sha: "i7j8k9l", message: "fix: resolve layout issues on mobile", author: "kWAYTV", date: "2 days ago" },
  { sha: "m0n1o2p", message: "feat: add blog section", author: "kWAYTV", date: "1 week ago" },
  { sha: "q3r4s5t", message: "style: improve theme consistency", author: "kWAYTV", date: "2 weeks ago" },
];

interface SourceControlViewProps {
  commits?: GitCommitItem[];
}

function CollapsibleSection({
  children,
  defaultOpen = true,
  title,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  title: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const Chevron = open ? ChevronDown : ChevronRight;

  return (
    <div className="flex flex-col">
      <button
        className="flex w-full items-center gap-1 py-[3px] pl-1 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <Chevron className="size-3.5 shrink-0 opacity-70" />
        {title}
      </button>
      {open && children}
    </div>
  );
}

export const SourceControlView = memo(function SourceControlView({
  commits = MOCK_COMMITS,
}: SourceControlViewProps) {
  const t = useTranslations("ide");
  const displayCommits = commits.length > 0 ? commits : MOCK_COMMITS;

  return (
    <div className="flex h-full w-56 shrink-0 select-none flex-col overflow-hidden border-border border-r bg-sidebar shadow-[var(--shadow-elevation-sm)]">
      {/* Header - matches VS Code */}
      <div className="flex items-center justify-between gap-1 border-border border-b px-2 py-2">
        <span className="flex-1 px-2 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
          {t("sourceControl")}
        </span>
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Refresh"
                className="size-6 rounded p-0"
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <RefreshCw className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Refresh</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label={t("moreActions")}
                className="size-6 rounded p-0"
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="ide-dropdown w-48 rounded-sm border border-border bg-popover p-0.5 shadow-lg"
              side="right"
            >
              <DropdownMenuItem asChild>
                <a
                  href={`${PORTFOLIO_REPO_URL}/commits/main`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <ExternalLink className="size-3.5" />
                  {t("viewOnGitHub")}
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Commit message + buttons - VS Code style */}
        <div className="flex flex-col gap-2 border-border border-b px-2 py-2">
          <div className="flex min-h-[28px] items-center gap-1.5 rounded px-2 py-1.5 text-[13px] text-muted-foreground ring-1 ring-inset ring-border/50">
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
            <Button
              className="h-7 flex-1 text-[11px]"
              disabled
              size="sm"
              variant="outline"
            >
              <RefreshCw className="size-3.5" />
              {t("syncChanges")}
            </Button>
          </div>
        </div>

        {/* Scrollable sections - CHANGES, STAGED, HISTORY */}
        <div className="flex-1 overflow-y-auto px-2 py-1">
          <CollapsibleSection defaultOpen={true} title={t("changes")}>
            <div className="rounded-md border border-border/60 bg-muted/20 px-2 py-2.5">
              <p className="text-[11px] text-muted-foreground">
                {t("noChanges")}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                {t("noChangesHint")}
              </p>
            </div>
          </CollapsibleSection>

          <CollapsibleSection defaultOpen={true} title={t("stagedChanges")}>
            <div className="rounded-md border border-border/60 bg-muted/20 px-2 py-2.5">
              <p className="text-[11px] text-muted-foreground">
                {t("noChanges")}
              </p>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            defaultOpen={true}
            title={t("commitHistory")}
          >
            <div className="space-y-0.5 py-1">
              {displayCommits.map((commit) => (
                <a
                  className={cn(
                    "block rounded px-2 py-1.5 text-left transition-colors",
                    "hover:bg-sidebar-accent/50"
                  )}
                  href={`${PORTFOLIO_REPO_URL}/commit/${commit.sha}`}
                  key={commit.sha}
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
              ))}
            </div>
          </CollapsibleSection>
        </div>

        {/* Branch + View on GitHub */}
        <div className="flex flex-col gap-1 border-border border-t px-2 py-2">
          <div className="flex items-center gap-1.5 rounded px-2 py-1.5 text-[11px] text-muted-foreground">
            <GitBranch className="size-3.5 shrink-0" />
            <span className="truncate font-medium">main</span>
          </div>
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
            <TooltipContent side="top">{t("openRepo")}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
});
