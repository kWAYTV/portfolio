"use client";

import { analytics } from "@repo/analytics";
import {
  Download,
  ExternalLink,
  GitBranch,
  GitFork,
  MoreHorizontal,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { REPO_URL } from "@/consts/ide-constants";
import { IDE_DROPDOWN_CONTENT_CLASS } from "@/lib/ide-dropdown";
import { cn } from "@/lib/utils";

interface SourceControlHeaderProps {
  isRefreshing: boolean;
  onClose?: () => void;
  onRefresh: () => void;
}

export function SourceControlHeader({
  isRefreshing,
  onClose,
  onRefresh,
}: SourceControlHeaderProps) {
  const t = useTranslations("ide");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-1 border-border border-b px-2 py-1.5">
      <span className="flex-1 truncate px-2 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
        {t("sourceControl")}
      </span>
      <div className="flex shrink-0 items-center gap-0.5">
        <DropdownMenu onOpenChange={setMenuOpen} open={menuOpen}>
          <DropdownMenuTrigger
            aria-label={t("moreActions")}
            className="flex size-6 shrink-0 items-center justify-center rounded p-0 transition-colors hover:bg-sidebar-accent/50"
          >
            <MoreHorizontal className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={cn(IDE_DROPDOWN_CONTENT_CLASS, "w-36")}
          >
            <a
              className="flex cursor-pointer items-center gap-1.5 px-2 py-1 text-xs outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground [&_svg]:size-3.5 [&_svg]:shrink-0"
              href={REPO_URL}
              onClick={() => {
                analytics.viewOnGitHub("source-control-menu");
                setMenuOpen(false);
              }}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink />
              {t("viewOnGitHub")}
            </a>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <Download className="size-3.5" />
              {t("pull")}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Upload className="size-3.5" />
              {t("push")}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <RefreshCw className="size-3.5" />
              {t("sync")}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <RefreshCw className="size-3.5" />
              {t("fetch")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <GitBranch className="size-3.5" />
              {t("publishBranch")}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <GitFork className="size-3.5" />
              {t("createBranch")}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <GitFork className="size-3.5" />
              {t("switchBranch")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          aria-label={t("refreshCommitHistory")}
          className="size-6 rounded p-0"
          disabled={isRefreshing}
          onClick={onRefresh}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <RefreshCw
            className={cn(
              "size-3.5",
              isRefreshing && "animate-[spin_0.6s_linear_infinite]"
            )}
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
  );
}
