"use client";

import { Link } from "@i18n/routing";
import { cn } from "@portfolio/ui";
import { X } from "lucide-react";
import { navItems } from "@/consts/nav-items";
import { FileIcon } from "./file-icon";

interface EditorTabsProps {
  onCloseTab: (href: string) => void;
  openTabs: Set<string>;
  pathname: string;
}

export function EditorTabs({
  pathname,
  openTabs,
  onCloseTab,
}: EditorTabsProps) {
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const visibleItems = navItems.filter((item) => openTabs.has(item.href));

  return (
    <div className="flex h-[35px] shrink-0 items-stretch overflow-x-auto bg-[var(--ide-tab-bar)]">
      {visibleItems.map((item) => {
        const active = isActive(item.href);
        return (
          <div
            className={cn(
              "group relative flex items-center whitespace-nowrap border-[var(--ide-border)] border-r text-xs transition-colors",
              active
                ? "bg-[var(--ide-tab-active)] text-[var(--ide-tab-active-fg)]"
                : "bg-[var(--ide-tab)] text-[var(--ide-tab-fg)] hover:bg-[var(--ide-tab-active)]/50"
            )}
            key={item.href}
          >
            {active && (
              <span className="absolute inset-x-0 top-0 h-[2px] bg-[var(--ide-tab-active-top)]" />
            )}
            <Link
              className="flex items-center gap-2 py-1 pr-1 pl-3"
              href={item.href}
            >
              <FileIcon className="size-3.5" type={item.fileType} />
              <span>{item.fileName}</span>
            </Link>
            <button
              className="mr-2 rounded-sm p-0.5 opacity-0 transition-opacity hover:bg-foreground/10 group-hover:opacity-60"
              onClick={() => onCloseTab(item.href)}
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
