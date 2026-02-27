"use client";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@portfolio/ui";
import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useCallback } from "react";
import { explorerTree } from "@/consts/explorer-tree";
import { useExplorerState } from "@/hooks/use-explorer-state";
import { ExplorerTreeItem } from "@/components/ide/sidebar/explorer-tree-item";

interface SidebarProps {
  onOpenTab?: (href: string) => void;
  pathname: string;
}

export const Sidebar = memo(function Sidebar({
  onOpenTab,
  pathname,
}: SidebarProps) {
  const t = useTranslations("ide");
  const {
    collapseAll,
    expandAll,
    expanded,
    handleCollapseAll,
    handleExpandAll,
    toggle,
  } = useExplorerState(explorerTree);

  const copyPath = useCallback((path: string) => {
    navigator.clipboard.writeText(path);
  }, []);

  const openInNewWindow = useCallback((href: string) => {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}${href}` : href;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="flex h-full w-56 shrink-0 select-none flex-col overflow-hidden border-border border-r bg-sidebar shadow-[var(--shadow-elevation-sm)]">
      <div className="flex items-center justify-between gap-1 px-2 py-2">
        <span className="flex-1 px-2 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
          {t("explorer")}
        </span>
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={t("expandAll")}
                className="size-6 rounded p-0"
                onClick={() => handleExpandAll()}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <ChevronsDownUp className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t("expandAll")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={t("collapseAll")}
                className="size-6 rounded p-0"
                onClick={() => handleCollapseAll()}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <ChevronsUpDown className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t("collapseAll")}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-4">
        <div>
          <button
            className="flex w-full items-center gap-1 py-[3px] pl-1 text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
            onClick={() => toggle("portfolio")}
            type="button"
          >
            {expanded.has("portfolio") ? (
              <ChevronDown className="size-4 shrink-0 opacity-70" />
            ) : (
              <ChevronRight className="size-4 shrink-0 opacity-70" />
            )}
            <span className="font-semibold text-[11px] uppercase tracking-wide">
              portfolio
            </span>
          </button>
          {expanded.has("portfolio") && (
            <div>
              {explorerTree.map((item) => (
                <ExplorerTreeItem
                  key={item.name}
                  copyPath={copyPath}
                  depth={1}
                  expanded={expanded}
                  item={item}
                  onCollapseAll={collapseAll}
                  onExpandAll={expandAll}
                  onOpenInNewWindow={openInNewWindow}
                  onOpenTab={onOpenTab}
                  onToggle={toggle}
                  path="portfolio"
                  pathname={pathname}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
