"use client";

import { Link } from "@i18n/routing";
import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@portfolio/ui";
import {
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";
import {
  explorerTree,
  type FolderItem,
  type TreeItem,
} from "@/consts/explorer-tree";
import { FileIcon } from "./file-icon";

interface SidebarProps {
  onOpenTab?: (href: string) => void;
  pathname: string;
}

export const Sidebar = memo(function Sidebar({
  onOpenTab,
  pathname,
}: SidebarProps) {
  const t = useTranslations("ide");
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(["portfolio", "src", "blog"])
  );

  const toggle = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  function getFolderNames(folder: FolderItem): string[] {
    return [
      folder.name,
      ...folder.children.flatMap((c) =>
        c.type === "folder" ? getFolderNames(c as FolderItem) : []
      ),
    ];
  }

  const expandAll = (folder: FolderItem) => {
    setExpanded((prev) => new Set([...prev, ...getFolderNames(folder)]));
  };

  const collapseAll = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.delete(name);
      return next;
    });
  };

  const allFolderNames = [
    "portfolio",
    ...explorerTree.flatMap((c) =>
      c.type === "folder" ? getFolderNames(c as FolderItem) : []
    ),
  ];

  const handleExpandAll = () => setExpanded(new Set(allFolderNames));
  const handleCollapseAll = () => setExpanded(new Set());

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
  };

  const openInNewWindow = (href: string) => {
    const url =
      typeof window !== "undefined" ? `${window.location.origin}${href}` : href;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const isFileActive = (href?: string) => {
    if (!href) {
      return false;
    }
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderItem = (
    item: TreeItem,
    depth: number,
    path: string
  ): React.ReactNode => {
    if (item.type === "folder") {
      const key = `${path}/${item.name}`;
      const isOpen = expanded.has(item.name);
      const Chevron = isOpen ? ChevronDown : ChevronRight;
      const FolderIcon = isOpen ? FolderOpen : Folder;

      return (
        <ContextMenu key={key}>
          <div>
            <ContextMenuTrigger asChild>
              <button
                className="flex w-full items-center gap-1 py-[3px] text-[13px] text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
                onClick={() => toggle(item.name)}
                style={{ paddingLeft: `${depth * 12 + 4}px` }}
                type="button"
              >
                <Chevron className="size-4 shrink-0 opacity-70" />
                <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="ml-1 truncate">{item.name}</span>
              </button>
            </ContextMenuTrigger>
            {isOpen && (
              <div>
                {item.children.map((child) =>
                  renderItem(child, depth + 1, key)
                )}
              </div>
            )}
          </div>
          <ContextMenuContent className="ide-dropdown w-44 rounded-sm border border-border bg-popover p-0.5 shadow-lg">
            <ContextMenuItem onClick={() => expandAll(item)}>
              {t("expandAll")}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => collapseAll(item.name)}>
              {t("collapseAll")}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => copyPath(key)}>
              {t("copyPath")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    }

    const key = `${path}/${item.name}`;
    const active = isFileActive(item.href);

    const content = (
      <div
        className={cn(
          "flex items-center gap-1 py-[3px] text-[13px] transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50",
          !item.href && "cursor-default opacity-50"
        )}
        style={{ paddingLeft: `${depth * 12 + 24}px` }}
      >
        <FileIcon className="size-4" type={item.fileType} />
        <span className="ml-1 truncate">{item.name}</span>
      </div>
    );

    if (item.href) {
      return (
        <ContextMenu key={key}>
          <ContextMenuTrigger asChild>
            <Link href={item.href} onClick={() => onOpenTab?.(item.href!)}>
              {content}
            </Link>
          </ContextMenuTrigger>
          <ContextMenuContent className="ide-dropdown w-44 rounded-sm border border-border bg-popover p-0.5 shadow-lg">
            <ContextMenuItem onClick={() => onOpenTab?.(item.href!)}>
              {t("open")}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => openInNewWindow(item.href!)}>
              {t("openInNewWindow")}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => copyPath(key)}>
              {t("copyPath")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    }

    return (
      <ContextMenu key={key}>
        <ContextMenuTrigger asChild>
          <div>{content}</div>
        </ContextMenuTrigger>
        <ContextMenuContent className="ide-dropdown w-44 rounded-sm border border-border bg-popover p-0.5 shadow-lg">
          <ContextMenuItem onClick={() => copyPath(key)}>
            {t("copyPath")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

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
                onClick={handleExpandAll}
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
                onClick={handleCollapseAll}
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
              {explorerTree.map((item) => renderItem(item, 1, "portfolio"))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
