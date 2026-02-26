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
  const { ref, isDragging } = useSortable({ id: href, index });

  return (
    <div
      className={cn(
        "group relative flex items-center whitespace-nowrap border-[var(--ide-border)] border-r text-xs transition-colors",
        active
          ? "bg-[var(--ide-tab-active)] text-[var(--ide-tab-active-fg)]"
          : "bg-[var(--ide-tab)] text-[var(--ide-tab-fg)] hover:bg-[var(--ide-tab-active)]/50",
        isDragging && "z-10 opacity-80 shadow-lg"
      )}
      ref={ref}
    >
      {active && !isDragging && (
        <span className="absolute inset-x-0 top-0 h-[2px] bg-[var(--ide-tab-active-top)]" />
      )}
      <Link
        className="flex items-center gap-2 py-1 pr-0 pl-3"
        draggable={false}
        href={href}
        onClick={(e) => {
          if (isDragging) {
            e.preventDefault();
          }
        }}
      >
        <FileIcon className="size-3.5" type={fileType} />
        <span>{fileName}</span>
      </Link>
      <button
        className="mr-1.5 ml-1 rounded-sm p-0.5 opacity-40 transition-opacity hover:bg-foreground/10 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
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

  const orderedItems = openTabs.flatMap((href) => {
    const item = navItems.find((n) => n.href === href);
    return item ? [item] : [];
  });

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
        if (!source) {
          return;
        }

        const sortable = source as {
          index?: number;
          initialIndex?: number;
        };
        const from = sortable.initialIndex;
        const to = sortable.index;

        if (from == null || to == null || from === to) {
          return;
        }

        const next = [...openTabs];
        const [item] = next.splice(from, 1);
        if (item) {
          next.splice(to, 0, item);
          onReorder(next);
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
