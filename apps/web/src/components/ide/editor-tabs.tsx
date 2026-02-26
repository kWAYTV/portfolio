"use client";

import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { Link } from "@i18n/routing";
import {
  cn,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@portfolio/ui";
import { Code2, X } from "lucide-react";
import { navItems } from "@/consts/nav-items";
import { FileIcon } from "./file-icon";

interface TabItemProps {
  active: boolean;
  fileName: string;
  fileType: string;
  href: string;
  index: number;
  onClose: () => void;
}

function TabItem({
  active,
  fileName,
  fileType,
  href,
  index,
  onClose,
}: TabItemProps) {
  const { ref } = useSortable({ id: href, index });

  return (
    <div
      className={cn(
        "group relative flex select-none items-center whitespace-nowrap border-[var(--ide-border)] border-r text-xs transition-colors",
        active
          ? "bg-[var(--ide-tab-active)] text-[var(--ide-tab-active-fg)]"
          : "bg-[var(--ide-tab)] text-[var(--ide-tab-fg)] hover:bg-[var(--ide-tab-active)]/50"
      )}
      ref={ref}
    >
      {active && (
        <span className="absolute inset-x-0 top-0 h-[2px] bg-[var(--ide-tab-active-top)]" />
      )}
      <Link className="flex items-center gap-2 py-1 pr-1 pl-3" href={href}>
        <FileIcon className="size-3.5" type={fileType} />
        <span>{fileName}</span>
      </Link>
      <button
        className="mr-2 rounded-sm p-0.5 opacity-0 transition-opacity hover:bg-foreground/10 group-hover:opacity-60"
        onClick={onClose}
        type="button"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

interface EditorTabsProps {
  onCloseTab: (href: string) => void;
  onReorder: (newOrder: string[]) => void;
  openTabs: string[];
  pathname: string;
}

export function EditorTabs({
  pathname,
  openTabs,
  onCloseTab,
  onReorder,
}: EditorTabsProps) {
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const visibleItems = navItems.filter((item) => openTabs.includes(item.href));
  const orderedItems = [...visibleItems].sort(
    (a, b) => openTabs.indexOf(a.href) - openTabs.indexOf(b.href)
  );

  if (orderedItems.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="h-[35px] shrink-0 bg-[var(--ide-tab-bar)]" />
        <Empty className="flex-1 border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Code2 />
            </EmptyMedia>
            <EmptyTitle className="text-sm">No open editors</EmptyTitle>
            <EmptyDescription className="text-xs">
              Open a file from the sidebar to start editing
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) {
          return;
        }
        const { source } = event.operation;
        if (
          source &&
          "index" in source &&
          "initialIndex" in source &&
          source.index !== source.initialIndex
        ) {
          const newOrder = [...openTabs];
          const oldIdx = source.initialIndex as number;
          const newIdx = source.index as number;
          const [moved] = newOrder.splice(oldIdx, 0);
          if (moved) {
            newOrder.splice(oldIdx, 1);
          }
          const item = openTabs[oldIdx];
          if (item) {
            const filtered = openTabs.filter((_, i) => i !== oldIdx);
            filtered.splice(newIdx, 0, item);
            onReorder(filtered);
          }
        }
      }}
    >
      <div className="flex h-[35px] shrink-0 items-stretch overflow-x-auto bg-[var(--ide-tab-bar)]">
        {orderedItems.map((item, index) => (
          <TabItem
            active={isActive(item.href)}
            fileName={item.fileName}
            fileType={item.fileType}
            href={item.href}
            index={index}
            key={item.href}
            onClose={() => onCloseTab(item.href)}
          />
        ))}
      </div>
    </DragDropProvider>
  );
}
