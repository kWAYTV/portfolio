"use client";

import { Link } from "@i18n/routing";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  cn,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@portfolio/ui";
import { Code2, PanelRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { memo } from "react";
import { navItems } from "@/consts/nav-items";
import { FileIcon } from "./file-icon";

interface TabItemProps {
  active: boolean;
  dragOverIndex: number | null;
  fileName: string;
  fileType: string;
  groupIndex: number;
  href: string;
  index: number;
  onClose: () => void;
  onDragEnd: () => void;
  onDragOver: (index: number) => void;
  onTabClick?: (href: string) => void;
}

function TabItem({
  active,
  dragOverIndex,
  fileName,
  fileType,
  groupIndex,
  href,
  index,
  onClose,
  onDragEnd,
  onDragOver,
  onTabClick,
}: TabItemProps) {
  const isDropTarget = dragOverIndex === index;

  return (
    <div
      className={cn(
        "group relative flex h-full min-w-0 max-w-[180px] select-none items-center border-border/60 border-r pr-1 text-[13px] transition-colors",
        active
          ? "bg-background text-foreground shadow-[var(--shadow-elevation-sm)]"
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
          e.dataTransfer.setData(
            "application/json",
            JSON.stringify({ href, index, groupIndex })
          );
        }}
      >
        <Link
          className="flex min-w-0 flex-1 items-center gap-2 truncate"
          draggable={false}
          href={href}
          onClick={() => onTabClick?.(href)}
        >
          <FileIcon className="size-4 shrink-0" type={fileType} />
          <span className="truncate">{fileName}</span>
        </Link>
      </div>
      <button
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-sm transition-colors",
          "opacity-0 group-hover:opacity-100",
          active && "opacity-100",
          active
            ? "text-foreground hover:bg-foreground/5"
            : "text-muted-foreground hover:bg-foreground/5"
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
  activeGroupIndex?: number;
  groupIndex?: number;
  onCloseAll: () => void;
  onCloseGroup?: (groupIndex: number) => void;
  onCloseOtherTabs: (href: string) => void;
  onCloseTab: (href: string) => void;
  onCloseTabsToRight: (href: string) => void;
  onDropFromOtherGroup?: (href: string, sourceGroupIndex: number) => void;
  onReorder: (newOrder: string[]) => void;
  onSplitLeft?: (href: string) => void;
  onSplitRight?: (href: string) => void;
  onTabClick?: (href: string) => void;
  openTabs: string[];
  pathname: string;
  showSplitButtons?: boolean;
  totalGroups?: number;
}

export const EditorTabs = memo(function EditorTabs({
  pathname,
  openTabs,
  onCloseTab,
  onCloseOtherTabs,
  onCloseTabsToRight,
  onCloseAll,
  onReorder,
  onCloseGroup,
  onDropFromOtherGroup,
  onSplitLeft,
  onSplitRight,
  onTabClick,
  showSplitButtons,
  totalGroups = 1,
  groupIndex = 0,
  activeGroupIndex = 0,
}: EditorTabsProps) {
  const t = useTranslations("ide");
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
      let sourceGroupIndex: number;
      try {
        const data = JSON.parse(e.dataTransfer.getData("application/json"));
        dragIndex = data.index;
        sourceGroupIndex = data.groupIndex ?? 0;
      } catch {
        return;
      }
      if (sourceGroupIndex !== groupIndex && onDropFromOtherGroup) {
        const href =
          openTabs[dragIndex] ?? e.dataTransfer.getData("text/plain");
        if (href) {
          onDropFromOtherGroup(href, sourceGroupIndex);
        }
        setDragOverIndex(null);
        return;
      }
      if (dragIndex === dropIndex) {
        return;
      }

      const next = [...openTabs];
      const [removed] = next.splice(dragIndex, 1);
      next.splice(dropIndex, 0, removed);
      onReorder(next);
      setDragOverIndex(null);
    },
    [openTabs, onReorder, groupIndex, onDropFromOtherGroup]
  );

  if (orderedItems.length === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="h-[35px] shrink-0 border-border border-b bg-muted/80 shadow-[var(--shadow-elevation-sm)]" />
        <Empty className="flex-1 border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Code2 />
            </EmptyMedia>
            <EmptyTitle className="text-sm">{t("noOpenEditors")}</EmptyTitle>
            <EmptyDescription className="text-xs">
              {t("openFileFromSidebar")}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="relative flex h-[35px] shrink-0 items-stretch overflow-x-auto border-border border-b bg-muted/80 shadow-[var(--shadow-elevation-sm)]">
      {/* Drop zone before first tab - absolute so it doesn't create a gap */}
      <div
        className={cn(
          "absolute top-0 left-0 z-10 h-full w-2 transition-colors",
          dragOverIndex === -1 && "bg-primary/20"
        )}
        onDragLeave={() => setDragOverIndex(null)}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          setDragOverIndex(-1);
        }}
        onDrop={(e) => handleDrop(e, 0)}
      />
      {orderedItems.map((item, index) => (
        <ContextMenu key={item.href}>
          <ContextMenuTrigger asChild>
            <div
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
                groupIndex={groupIndex}
                href={item.href}
                index={index}
                onClose={() => onCloseTab(item.href)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onTabClick={onTabClick}
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="ide-dropdown w-44 rounded-sm border border-border bg-popover p-0.5 shadow-lg">
            <ContextMenuItem onClick={() => onCloseTab(item.href)}>
              {t("close")}
            </ContextMenuItem>
            {showSplitButtons && totalGroups !== undefined && (
              <>
                <ContextMenuSeparator />
                {((groupIndex ?? 0) < totalGroups - 1 || totalGroups === 1) && (
                  <ContextMenuItem onClick={() => onSplitRight?.(item.href)}>
                    {totalGroups === 1 ? t("openToRight") : t("splitRight")}
                  </ContextMenuItem>
                )}
                {((groupIndex ?? 0) > 0 || totalGroups === 1) && (
                  <ContextMenuItem onClick={() => onSplitLeft?.(item.href)}>
                    {totalGroups === 1 ? t("openToLeft") : t("splitLeft")}
                  </ContextMenuItem>
                )}
              </>
            )}
            {orderedItems.length > 1 && (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => onCloseOtherTabs(item.href)}>
                  {t("closeOthers")}
                </ContextMenuItem>
                <ContextMenuItem
                  disabled={index >= orderedItems.length - 1}
                  onClick={() => onCloseTabsToRight(item.href)}
                >
                  {t("closeToRight")}
                </ContextMenuItem>
              </>
            )}
            <ContextMenuSeparator />
            {onCloseGroup && totalGroups !== undefined && totalGroups > 1 && (
              <ContextMenuItem onClick={() => onCloseGroup(groupIndex)}>
                {t("closeGroup")}
              </ContextMenuItem>
            )}
            <ContextMenuItem onClick={onCloseAll}>
              {t("closeAll")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
      {/* Drop zone after last tab - allows moving to end */}
      <div
        className={cn(
          "min-w-[12px] flex-1 shrink-0 transition-colors",
          dragOverIndex === orderedItems.length && "bg-primary/20"
        )}
        onDragLeave={() => setDragOverIndex(null)}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          setDragOverIndex(orderedItems.length);
        }}
        onDrop={(e) => handleDrop(e, orderedItems.length)}
      />
      {showSplitButtons && totalGroups !== undefined && totalGroups < 2 && (
        <button
          className="flex shrink-0 items-center justify-center px-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          onClick={() => {
            const activeItem =
              orderedItems.find((i) => isActive(i.href)) ?? orderedItems[0];
            if (activeItem) {
              onSplitRight?.(activeItem.href);
            }
          }}
          title={t("openToRight")}
          type="button"
        >
          <PanelRight className="size-4" />
        </button>
      )}
    </div>
  );
});
