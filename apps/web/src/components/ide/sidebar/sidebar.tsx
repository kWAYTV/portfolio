"use client";

import {
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { explorerTree } from "@/components/ide/config";
import { ExplorerTreeItem } from "@/components/ide/sidebar/explorer-tree-item";
import { Button } from "@/components/ui/button";
import { useExplorerExpanded, useIdeStore } from "@/stores/ide-store";

interface SidebarProps {
  fullWidth?: boolean;
  onClose?: () => void;
  pathname: string;
}

export function Sidebar({
  fullWidth = false,
  onClose,
  pathname,
}: SidebarProps) {
  const openTab = useIdeStore((s) => s.openTab);
  const { expanded, toggle, expandAll, collapseAll, isFullyExpanded } =
    useExplorerExpanded();

  return (
    <div
      className={`flex h-full select-none flex-col overflow-hidden bg-sidebar shadow-(--shadow-elevation-sm) ${
        fullWidth ? "w-full min-w-0" : "w-56 shrink-0 border-border border-r"
      }`}
    >
      <div className="flex items-center justify-between gap-1 px-2 py-2">
        <span className="flex-1 px-2 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
          Explorer
        </span>
        <div className="flex items-center gap-0.5">
          {onClose && (
            <Button
              aria-label="Close"
              className="size-6 rounded p-0"
              onClick={onClose}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          )}
          {!isFullyExpanded && (
            <Button
              aria-label="Expand all"
              className="size-6 rounded p-0"
              onClick={expandAll}
              size="icon"
              title="Expand all"
              type="button"
              variant="ghost"
            >
              <ChevronsUpDown className="size-3.5" />
            </Button>
          )}
          <Button
            aria-label="Collapse all"
            className="size-6 rounded p-0"
            onClick={collapseAll}
            size="icon"
            title="Collapse all"
            type="button"
            variant="ghost"
          >
            <ChevronsDownUp className="size-3.5" />
          </Button>
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
              <ChevronDown
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground/70"
              />
            ) : (
              <ChevronRight
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground/70"
              />
            )}
            <span className="font-semibold text-[11px] uppercase tracking-wide">
              portfolio
            </span>
          </button>
          {expanded.has("portfolio") && (
            <div>
              {explorerTree.map((item) => (
                <ExplorerTreeItem
                  depth={1}
                  expanded={expanded}
                  item={item}
                  key={item.name}
                  onOpenTab={openTab}
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
}
