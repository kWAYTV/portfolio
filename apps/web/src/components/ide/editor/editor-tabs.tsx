"use client";

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { navItems } from "@/components/ide/config";
import { EditorTabContextMenu } from "@/components/ide/editor/editor-tab-context-menu";
import {
  EditorTabItem,
  EditorTabItemStatic,
} from "@/components/ide/editor/editor-tab-item";
import { EditorTabsEmpty } from "@/components/ide/editor/editor-tabs-empty";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { matchNavItem } from "@/lib/ide/breadcrumb";

interface EditorTabsProps {
  onCloseAll: () => void;
  onCloseOtherTabs: (href: string) => void;
  onCloseTab: (href: string) => void;
  onCloseTabsToRight: (href: string) => void;
  onReorder: (newOrder: string[]) => void;
  openTabs: string[];
  pathname: string;
}

export function EditorTabs({
  pathname,
  openTabs,
  onCloseTab,
  onCloseAll,
  onCloseOtherTabs,
  onCloseTabsToRight,
  onReorder,
}: EditorTabsProps) {
  const [mounted, setMounted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => setMounted(true), []);

  const orderedItems = openTabs.flatMap((href) => {
    const item = navItems.find((n) => n.href === href);
    return item ? [item] : [];
  });

  const isActive = (href: string) => {
    const navItem = matchNavItem(pathname, navItems);
    return navItem?.href === href;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = openTabs.indexOf(active.id as string);
    const newIndex = openTabs.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    onReorder(arrayMove(openTabs, oldIndex, newIndex));
  };

  if (orderedItems.length === 0) {
    return <EditorTabsEmpty />;
  }

  // Defer DndContext to client-only to avoid hydration mismatch from
  // dnd-kit's non-deterministic aria-describedby IDs (DndDescribedBy-N)
  const renderTab = (item: (typeof navItems)[number], index: number) => {
    const tabProps = {
      active: isActive(item.href),
      fileName: item.fileName,
      fileType: item.fileType,
      href: item.href,
      onClose: () => onCloseTab(item.href),
    };
    const tab = mounted ? (
      <EditorTabItem key={item.href} {...tabProps} />
    ) : (
      <EditorTabItemStatic key={item.href} {...tabProps} />
    );
    return (
      <ContextMenu key={item.href}>
        <ContextMenuTrigger asChild>
          <div className="contents">{tab}</div>
        </ContextMenuTrigger>
        <EditorTabContextMenu
          href={item.href}
          index={index}
          onCloseAll={onCloseAll}
          onCloseOtherTabs={onCloseOtherTabs}
          onCloseTab={onCloseTab}
          onCloseTabsToRight={onCloseTabsToRight}
          orderedItemsLength={orderedItems.length}
        />
      </ContextMenu>
    );
  };

  const container = (
    <div className="relative flex h-[35px] shrink-0 cursor-default items-stretch overflow-x-auto border-border border-b bg-muted/80 shadow-(--shadow-elevation-sm)">
      {orderedItems.map((item, index) => renderTab(item, index))}
    </div>
  );

  if (!mounted) {
    return container;
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <SortableContext
        items={openTabs}
        strategy={horizontalListSortingStrategy}
      >
        {container}
      </SortableContext>
    </DndContext>
  );
}
