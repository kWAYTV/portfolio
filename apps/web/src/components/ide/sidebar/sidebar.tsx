"use client";

import {
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { explorerTree } from "@/components/ide/config";
import { ExplorerTreeItem } from "@/components/ide/sidebar/explorer-tree-item";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditorGroupsStore } from "@/stores/editor-groups-store";
import { useExplorerExpanded } from "@/stores/ide-store";

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
  const t = useTranslations("ide");
  const openTab = useEditorGroupsStore((s) => s.openTab);
  const { expanded, toggle, expandAll, collapseAll, isFullyExpanded } =
    useExplorerExpanded();

  const copyPath = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      toast.success(t("pathCopied"));
    } catch {
      toast.error(t("pathCopyFailed"));
    }
  };

  return (
    <div
      className={`flex h-full select-none flex-col overflow-hidden bg-sidebar shadow-(--shadow-elevation-sm) ${
        fullWidth ? "w-full min-w-0" : "w-56 shrink-0 border-border border-r"
      }`}
    >
      <div className="flex items-center justify-between gap-1 px-2 py-2">
        <span className="flex-1 px-2 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
          {t("explorer")}
        </span>
        <div className="flex items-center gap-0.5">
          {onClose && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label={t("close")}
                  className="size-6 rounded p-0"
                  onClick={onClose}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <X className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("close")}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {!isFullyExpanded && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label={t("expandAll")}
                  className="size-6 rounded p-0"
                  onClick={expandAll}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <ChevronsUpDown className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("expandAll")}</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={t("collapseAll")}
                className="size-6 rounded p-0"
                onClick={collapseAll}
                size="icon"
                type="button"
                variant="ghost"
              >
                <ChevronsDownUp className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("collapseAll")}</p>
            </TooltipContent>
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
                  collapseAll={collapseAll}
                  copyPath={copyPath}
                  depth={1}
                  expandAll={expandAll}
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
