"use client";

import { PanelRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { navItems } from "@/components/ide/config";
import { EditorTabContextMenu } from "@/components/ide/editor/editor-tab-context-menu";
import {
  EditorTabItem,
  EditorTabItemStatic,
} from "@/components/ide/editor/editor-tab-item";
import { EditorTabsEmpty } from "@/components/ide/editor/editor-tabs-empty";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { matchNavItem } from "@/lib/ide/breadcrumb";
import { cn } from "@/lib/utils";

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

export function EditorTabs({
  pathname,
  openTabs,
  onCloseTab,
  onCloseAll,
  onCloseOtherTabs,
  onCloseTabsToRight,
  onReorder,
  onTabClick,
  groupIndex = 0,
  activeGroupIndex: _activeGroupIndex = 0,
  onSplitLeft,
  onSplitRight,
  showSplitButtons = false,
  totalGroups = 1,
  onCloseGroup,
  onDropFromOtherGroup,
}: EditorTabsProps) {
  const t = useTranslations("ide");
  const [mounted, setMounted] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => setMounted(true), []);

  const orderedItems = openTabs.flatMap((href) => {
    const item = navItems.find((n) => n.href === href);
    return item ? [item] : [];
  });

  const isActive = (href: string) => {
    const navItem = matchNavItem(pathname, navItems);
    return navItem?.href === href;
  };

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    document.body.style.cursor = "grabbing";
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = "";
    setDragOverIndex(null);
  }, []);

  const handleDragOver = useCallback((index: number) => {
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback(
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
        setDragOverIndex(null);
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

  const renderTab = (item: (typeof navItems)[number], index: number) => {
    const tabProps = {
      active: isActive(item.href),
      fileName: item.fileName,
      fileType: item.fileType,
      href: item.href,
      onClose: () => onCloseTab(item.href),
      onTabClick,
    };
    const commonProps = {
      ...tabProps,
      dragOverIndex,
      groupIndex,
      index,
      isDragging,
      onDragEnd: handleDragEnd,
      onDragOver: handleDragOver,
      onDragStart: handleDragStart,
    };
    const tab = mounted ? (
      <EditorTabItem key={item.href} {...commonProps} />
    ) : (
      <EditorTabItemStatic key={item.href} {...tabProps} />
    );
    return (
      <ContextMenu key={item.href}>
        <ContextMenuTrigger asChild>
          {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions lint/a11y/noStaticElementInteractions: HTML5 drop zone */}
          <div
            className="flex h-full"
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setDragOverIndex(index);
            }}
            onDrop={(e) => handleDrop(e, index)}
          >
            {tab}
          </div>
        </ContextMenuTrigger>
        <EditorTabContextMenu
          groupIndex={groupIndex}
          href={item.href}
          index={index}
          onCloseAll={onCloseAll}
          onCloseGroup={
            onCloseGroup ? () => onCloseGroup(groupIndex) : undefined
          }
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
    );
  };

  return (
    <div className="relative flex h-[35px] shrink-0 cursor-default items-stretch border-border border-b bg-muted/80 shadow-(--shadow-elevation-sm)">
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions lint/a11y/noStaticElementInteractions: HTML5 drop zone */}
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
      <div className="flex min-w-0 flex-1 overflow-x-auto">
        {orderedItems.map((item, index) => renderTab(item, index))}
      </div>
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions lint/a11y/noStaticElementInteractions: HTML5 drop zone */}
      <div
        className={cn(
          "min-w-3 flex-1 shrink-0 cursor-default transition-colors",
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
          className="hidden shrink-0 items-center justify-center border-border border-l px-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground md:flex"
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
}
