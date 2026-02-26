"use client";

import { Link } from "@i18n/routing";
import { cn } from "@portfolio/ui";
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import { useState } from "react";
import { FileIcon } from "./file-icon";

interface FileItem {
  fileType: string;
  href?: string;
  name: string;
  type: "file";
}

interface FolderItem {
  children: TreeItem[];
  name: string;
  type: "folder";
}

type TreeItem = FileItem | FolderItem;

const explorerTree: TreeItem[] = [
  { name: ".env", type: "file", fileType: "env" },
  { name: "package.json", type: "file", fileType: "json" },
  {
    name: "src",
    type: "folder",
    children: [
      { name: "welcome.tsx", type: "file", fileType: "tsx", href: "/" },
      { name: "about.md", type: "file", fileType: "md", href: "/about" },
      {
        name: "projects.ts",
        type: "file",
        fileType: "ts",
        href: "/projects",
      },
      {
        name: "blog",
        type: "folder",
        children: [
          {
            name: "index.mdx",
            type: "file",
            fileType: "mdx",
            href: "/blog",
          },
        ],
      },
    ],
  },
  { name: "tsconfig.json", type: "file", fileType: "json" },
  { name: "README.md", type: "file", fileType: "md" },
];

interface SidebarProps {
  pathname: string;
}

export function Sidebar({ pathname }: SidebarProps) {
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
        <div key={key}>
          <button
            className="flex w-full items-center gap-1 py-[3px] text-[13px] text-[var(--ide-sidebar-fg)] transition-colors hover:bg-[var(--ide-sidebar-hover)]"
            onClick={() => toggle(item.name)}
            style={{ paddingLeft: `${depth * 12 + 4}px` }}
            type="button"
          >
            <Chevron className="size-4 shrink-0 opacity-70" />
            <FolderIcon className="size-4 shrink-0 text-[var(--ide-sidebar-header-fg)]" />
            <span className="ml-1 truncate">{item.name}</span>
          </button>
          {isOpen && (
            <div>
              {item.children.map((child) => renderItem(child, depth + 1, key))}
            </div>
          )}
        </div>
      );
    }

    const key = `${path}/${item.name}`;
    const active = isFileActive(item.href);

    const content = (
      <div
        className={cn(
          "flex items-center gap-1 py-[3px] text-[13px] transition-colors",
          active
            ? "bg-[var(--ide-sidebar-active)] text-foreground"
            : "text-[var(--ide-sidebar-fg)] hover:bg-[var(--ide-sidebar-hover)]",
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
        <Link href={item.href} key={key}>
          {content}
        </Link>
      );
    }

    return <div key={key}>{content}</div>;
  };

  return (
    <div className="flex h-full w-56 shrink-0 flex-col overflow-hidden border-[var(--ide-border)] border-r bg-[var(--ide-sidebar)]">
      <div className="px-4 py-2">
        <span className="font-medium text-[11px] text-[var(--ide-sidebar-header-fg)] uppercase tracking-wider">
          Explorer
        </span>
      </div>
      <div className="flex-1 overflow-y-auto pb-4">
        <div>
          <button
            className="flex w-full items-center gap-1 py-[3px] pl-1 text-[var(--ide-sidebar-fg)] transition-colors hover:bg-[var(--ide-sidebar-hover)]"
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
}
