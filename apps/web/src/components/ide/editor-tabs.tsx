"use client";

import React from "react";
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
  onDragEnd: () => void;
  onDragOver: (index: number) => void;
  dragOverIndex: number | null;
}

function TabItem({
  active,
  fileName,
  fileType,
  href,
  index,
  onClose,
  onDragEnd,
  onDragOver,
  dragOverIndex,
}: TabItemProps) {
  const isDropTarget = dragOverIndex === index;

  return (
    <div
      className={cn(
        "group relative flex h-full min-w-0 max-w-[180px] select-none items-center border-r border-border/60 text-[13px] transition-colors",
        active
          ? "bg-background text-foreground"
          : "bg-muted/40 text-muted-foreground hover:bg-muted/70",
        isDropTarget && "border-l-2 border-l-primary"
      )}
    >
      {active && (
        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-primary" />
      )}
      <div
        className="flex min-w-0 flex-1 cursor-grab items-center gap-2 overflow-hidden px-3 py-1.5 active:cursor-grabbing"
        draggable
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          onDragOver(index);
        }}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", href);
          e.dataTransfer.setData("application/json", JSON.stringify({ href, index }));
        }}
      >
        <Link
          className="flex min-w-0 flex-1 items-center gap-2 truncate"
          draggable={false}
          href={href}
        >
          <FileIcon className="size-4 shrink-0" type={fileType} />
          <span className="truncate">{fileName}</span>
        </Link>
      </div>
      <button
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded transition-colors hover:bg-foreground/10",
          "opacity-0 group-hover:opacity-100",
          active && "opacity-70"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        type="button"
      >
        <X className="size-3.5" />
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

  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const handleDragEnd = React.useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDragOver = React.useCallback((index: number) => {
    setDragOverIndex(index);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      let dragIndex: number;
      try {
        const data = JSON.parse(e.dataTransfer.getData("application/json"));
        dragIndex = data.index;
      } catch {
        return;
      }
      if (dragIndex === dropIndex) return;

      const next = [...openTabs];
      const [removed] = next.splice(dragIndex, 1);
      next.splice(dropIndex, 0, removed);
      onReorder(next);
      setDragOverIndex(null);
    },
    [openTabs, onReorder]
  );

  if (orderedItems.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="h-[35px] shrink-0 border-b border-border bg-muted/80" />
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
    <div className="flex h-[35px] shrink-0 items-stretch overflow-x-auto border-b border-border bg-muted/80">
      {orderedItems.map((item, index) => (
        <div
          key={item.href}
          className="flex h-full"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            setDragOverIndex(index);
          }}
          onDrop={(e) => handleDrop(e, index)}
        >
          <TabItem
            active={isActive(item.href)}
            dragOverIndex={dragOverIndex}
            fileName={item.fileName}
            fileType={item.fileType}
            href={item.href}
            index={index}
            onClose={() => onCloseTab(item.href)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          />
        </div>
      ))}
    </div>
  );
}
