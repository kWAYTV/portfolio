"use client";

import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import type { TreeItem } from "@/components/ide/config";
import { FileIcon } from "@/components/ide/sidebar/file-icon";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { LocaleLink } from "@/modules/i18n/routing";

function isFileActive(pathname: string, href?: string): boolean {
  if (!href) {
    return false;
  }
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface ExplorerTreeItemProps {
  collapseAll: () => void;
  copyPath: (path: string) => void;
  depth: number;
  expandAll: () => void;
  expanded: Set<string>;
  item: TreeItem;
  onOpenTab?: (href: string) => void;
  onToggle: (name: string) => void;
  path: string;
  pathname: string;
}

export function ExplorerTreeItem({
  copyPath,
  collapseAll,
  depth,
  expandAll,
  expanded,
  item,
  onOpenTab,
  onToggle,
  path,
  pathname,
}: ExplorerTreeItemProps) {
  const t = useTranslations("ide");

  if (item.type === "folder") {
    const key = `${path}/${item.name}`;
    const isOpen = expanded.has(key);
    const Chevron = isOpen ? ChevronDown : ChevronRight;
    const FolderIcon = isOpen ? FolderOpen : Folder;

    return (
      <div key={key}>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <button
              className="flex w-full items-center gap-1 py-[3px] text-[13px] text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
              onClick={() => onToggle(key)}
              style={{ paddingLeft: `${depth * 12 + 4}px` }}
              type="button"
            >
              <Chevron
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground/70"
              />
              <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
              <span className="ml-1 truncate">{item.name}</span>
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-44 rounded-sm border border-border bg-popover p-0.5">
            <ContextMenuItem onClick={expandAll}>
              {t("expandAll")}
            </ContextMenuItem>
            <ContextMenuItem onClick={collapseAll}>
              {t("collapseAll")}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => copyPath(key)}>
              {t("copyPath")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        {isOpen && (
          <div>
            {item.children.map((child) => (
              <ExplorerTreeItem
                collapseAll={collapseAll}
                copyPath={copyPath}
                depth={depth + 1}
                expandAll={expandAll}
                expanded={expanded}
                item={child}
                key={`${key}/${child.name}`}
                onOpenTab={onOpenTab}
                onToggle={onToggle}
                path={key}
                pathname={pathname}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const key = `${path}/${item.name}`;
  const active = isFileActive(pathname, item.href);

  const content = (
    <div
      className={`flex items-center gap-1 py-[3px] text-[13px] transition-colors ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      } ${item.href ? "" : "cursor-default opacity-50"}`}
      style={{ paddingLeft: `${depth * 12 + 24}px` }}
    >
      <FileIcon className="size-4" name={item.name} type={item.fileType} />
      <span className="ml-1 truncate">{item.name}</span>
    </div>
  );

  if (item.href) {
    const href = item.href;
    return (
      <ContextMenu key={key}>
        <ContextMenuTrigger asChild>
          <LocaleLink href={href} onClick={() => onOpenTab?.(href)}>
            {content}
          </LocaleLink>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-44 rounded-sm border border-border bg-popover p-0.5">
          <ContextMenuItem onClick={() => onOpenTab?.(href)}>
            {t("open")}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => window.open(href, "_blank")}>
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
      <ContextMenuContent className="w-44 rounded-sm border border-border bg-popover p-0.5">
        <ContextMenuItem onClick={() => copyPath(key)}>
          {t("copyPath")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
