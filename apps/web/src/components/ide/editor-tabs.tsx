"use client";

import { Link } from "@i18n/routing";
import { cn } from "@portfolio/ui";
import { X } from "lucide-react";
import { navItems } from "@/consts/nav-items";
import { FileIcon } from "./file-icon";

interface EditorTabsProps {
  pathname: string;
}

export function EditorTabs({ pathname }: EditorTabsProps) {
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-[35px] shrink-0 items-stretch overflow-x-auto bg-[var(--ide-tab-bar)]">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            className={cn(
              "group relative flex items-center gap-2 border-r border-[var(--ide-border)] px-3 text-xs whitespace-nowrap transition-colors",
              active
                ? "bg-[var(--ide-tab-active)] text-[var(--ide-tab-active-fg)]"
                : "bg-[var(--ide-tab)] text-[var(--ide-tab-fg)] hover:bg-[var(--ide-tab-active)]/50"
            )}
            href={item.href}
            key={item.href}
          >
            {active && (
              <span className="absolute inset-x-0 top-0 h-[2px] bg-[var(--ide-tab-active-top)]" />
            )}
            <FileIcon className="size-3.5" type={item.fileType} />
            <span>{item.fileName}</span>
            <span className="ml-1 opacity-0 transition-opacity group-hover:opacity-40">
              <X className="size-3" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
