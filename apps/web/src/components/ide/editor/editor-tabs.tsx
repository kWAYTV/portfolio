"use client";

import { ContextMenu, ContextMenuTrigger, cn } from "@portfolio/ui";
import { PanelRight } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { memo } from "react";
import { EditorTabContextMenu } from "@/components/ide/editor/editor-tab-context-menu";
import { EditorTabItem } from "@/components/ide/editor/editor-tab-item";
import { EditorTabsEmpty } from "@/components/ide/editor/editor-tabs-empty";
import { navItems } from "@/consts/nav-items";

export interface EditorTabsProps {
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
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = React.useCallback(() => {
    setIsDragging(true);
    document.body.style.cursor = "grabbing";
  }, []);

  const handleDragEnd = React.useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = "";
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
    return <EditorTabsEmpty />;
  }

  return (
    <div className="relative flex h-[35px] shrink-0 cursor-default items-stretch overflow-x-auto border-border border-b bg-muted/80 shadow-elevation-sm">
      {/* Drop zone before first tab - absolute so it doesn't create a gap */}
      <div
        className={cn(
          "absolute top-0 left-0 z-10 h-full w-2 cursor-default transition-colors",
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
              <EditorTabItem
                active={isActive(item.href)}
                dragOverIndex={dragOverIndex}
                fileName={item.fileName}
                fileType={item.fileType}
                groupIndex={groupIndex}
                href={item.href}
                index={index}
                isDragging={isDragging}
                onClose={() => onCloseTab(item.href)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragStart={handleDragStart}
                onTabClick={onTabClick}
              />
            </div>
          </ContextMenuTrigger>
          <EditorTabContextMenu
            groupIndex={groupIndex}
            index={index}
            itemHref={item.href}
            onCloseAll={onCloseAll}
            onCloseGroup={onCloseGroup}
            onCloseOtherTabs={onCloseOtherTabs}
            onCloseTab={onCloseTab}
            onCloseTabsToRight={onCloseTabsToRight}
            onSplitLeft={onSplitLeft}
            onSplitRight={onSplitRight}
            orderedItemsLength={orderedItems.length}
            showSplitButtons={showSplitButtons}
            totalGroups={totalGroups}
          />
        </ContextMenu>
      ))}
      {/* Drop zone after last tab - allows moving to end */}
      <div
        className={cn(
          "min-w-[12px] flex-1 shrink-0 cursor-default transition-colors",
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
          aria-label={t("openToRight")}
          className="hidden shrink-0 items-center justify-center px-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground md:flex"
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
