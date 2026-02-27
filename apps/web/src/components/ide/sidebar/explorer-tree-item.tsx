"use client";

import { LocaleLink } from "@i18n/routing";
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import type { TreeItem } from "../config";
import { FileIcon } from "./file-icon";

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
  depth: number;
  expanded: Set<string>;
  item: TreeItem;
  onOpenTab?: (href: string) => void;
  onToggle: (name: string) => void;
  path: string;
  pathname: string;
}

export function ExplorerTreeItem({
  depth,
  expanded,
  item,
  onOpenTab,
  onToggle,
  path,
  pathname,
}: ExplorerTreeItemProps) {
  if (item.type === "folder") {
    const key = `${path}/${item.name}`;
    const isOpen = expanded.has(key);
    const Chevron = isOpen ? ChevronDown : ChevronRight;
    const FolderIcon = isOpen ? FolderOpen : Folder;

    return (
      <div key={key}>
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
        {isOpen && (
          <div>
            {item.children.map((child) => (
              <ExplorerTreeItem
                depth={depth + 1}
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
    return (
      <LocaleLink
        href={item.href}
        key={key}
        onClick={() => item.href && onOpenTab?.(item.href)}
      >
        {content}
      </LocaleLink>
    );
  }

  return <div key={key}>{content}</div>;
}
