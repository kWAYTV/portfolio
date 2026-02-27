"use client";

import { Link } from "@i18n/routing";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  cn,
} from "@portfolio/ui";
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { FileIcon } from "@/components/ide/sidebar/file-icon";
import type { FolderItem, TreeItem } from "@/consts/explorer-tree";

interface ExplorerTreeItemProps {
  copyPath: (path: string) => void;
  depth: number;
  expanded: Set<string>;
  item: TreeItem;
  onCollapseAll: (name: string) => void;
  onExpandAll: (folder: FolderItem) => void;
  onOpenInNewWindow: (href: string) => void;
  onOpenTab?: (href: string) => void;
  onToggle: (name: string) => void;
  path: string;
  pathname: string;
}

function isFileActive(pathname: string, href?: string): boolean {
  if (!href) {
    return false;
  }
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ExplorerTreeItem({
  copyPath,
  depth,
  expanded,
  item,
  onCollapseAll,
  onExpandAll,
  onOpenInNewWindow,
  onOpenTab,
  onToggle,
  path,
  pathname,
}: ExplorerTreeItemProps) {
  const t = useTranslations("ide");

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
              onClick={() => onToggle(item.name)}
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
              {item.children.map((child) => (
                <ExplorerTreeItem
                  copyPath={copyPath}
                  depth={depth + 1}
                  expanded={expanded}
                  item={child}
                  key={`${key}/${child.name}`}
                  onCollapseAll={onCollapseAll}
                  onExpandAll={onExpandAll}
                  onOpenInNewWindow={onOpenInNewWindow}
                  onOpenTab={onOpenTab}
                  onToggle={onToggle}
                  path={key}
                  pathname={pathname}
                />
              ))}
            </div>
          )}
        </div>
        <ContextMenuContent className="ide-dropdown w-44 rounded-sm border border-border bg-popover p-0.5 shadow-lg">
          <ContextMenuItem onClick={() => onExpandAll(item)}>
            {t("expandAll")}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onCollapseAll(item.name)}>
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
  const active = isFileActive(pathname, item.href);

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
          <ContextMenuItem onClick={() => onOpenInNewWindow(item.href!)}>
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
}
