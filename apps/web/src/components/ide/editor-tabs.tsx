"use client";

import { move } from "@dnd-kit/helpers";
import { DragDropProvider, DragOverlay, useDragOperation } from "@dnd-kit/react";
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
  isOverlay?: boolean;
}

function TabItem({
  active,
  fileName,
  fileType,
  href,
  index,
  onClose,
  isOverlay = false,
}: TabItemProps) {
  const { ref, isDragging } = useSortable({ id: href, index });

  return (
    <div
      className={cn(
        "group relative flex select-none items-center whitespace-nowrap border-border border-r text-xs transition-[color,transform] duration-200",
        active
          ? "bg-background text-foreground"
          : "bg-muted text-muted-foreground hover:bg-background/50",
        isDragging && !isOverlay && "z-10 opacity-50",
        isOverlay && "z-50 cursor-grabbing shadow-lg"
      )}
      ref={isOverlay ? undefined : ref}
    >
      {active && !isDragging && (
        <span className="absolute inset-x-0 top-0 h-[2px] bg-primary" />
      )}
      <Link
        className="flex cursor-grab items-center gap-2 py-1 pr-1 pl-3 active:cursor-grabbing"
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
        className={cn(
          "mr-1.5 ml-1 rounded-sm p-0.5 transition-opacity hover:bg-foreground/10 hover:opacity-100",
          active
            ? "opacity-60"
            : "pointer-events-none opacity-0 group-hover:opacity-60 group-hover:pointer-events-auto"
        )}
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

function TabOverlayContent({
  pathname,
  orderedItems,
  onCloseTab,
}: {
  pathname: string;
  orderedItems: Array<{ href: string; fileName: string; fileType: string }>;
  onCloseTab: (href: string) => void;
}) {
  const source = useDragOperation().source;
  if (!source) return null;

  const item = orderedItems.find((i) => i.href === source.id);
  if (!item) return null;

  const isActive =
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  return (
    <TabItem
      active={isActive}
      fileName={item.fileName}
      fileType={item.fileType}
      href={item.href}
      index={0}
      isOverlay
      onClose={() => onCloseTab(item.href)}
    />
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
        <div className="h-[35px] shrink-0 bg-muted" />
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
        if (event.canceled) return;
        const next = move(openTabs, event);
        if (next !== openTabs) {
          onReorder(next);
        }
      }}
    >
      <div className="flex h-[35px] shrink-0 items-stretch overflow-x-auto bg-muted">
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
      <DragOverlay
        disabled={(source) => !source}
        dropAnimation={{ duration: 200 }}
      >
        <TabOverlayContent
          onCloseTab={onCloseTab}
          orderedItems={orderedItems}
          pathname={pathname}
        />
      </DragOverlay>
    </DragDropProvider>
  );
}
