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
import { navItems } from "@/components/ide/config";
import { EditorTabItem } from "@/components/ide/editor/editor-tab-item";
import { EditorTabsEmpty } from "@/components/ide/editor/editor-tabs-empty";
import { useIdeStore } from "@/stores/ide-store";

interface EditorTabsProps {
  pathname: string;
}

export function EditorTabs({ pathname }: EditorTabsProps) {
  const openTabs = useIdeStore((s) => s.openTabs);
  const closeTab = useIdeStore((s) => s.closeTab);
  const openTab = useIdeStore((s) => s.openTab);
  const reorderTabs = useIdeStore((s) => s.reorderTabs);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const orderedItems = openTabs.flatMap((href) => {
    const item = navItems.find((n) => n.href === href);
    return item ? [item] : [];
  });

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
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

    reorderTabs(arrayMove(openTabs, oldIndex, newIndex));
  };

  if (orderedItems.length === 0) {
    return <EditorTabsEmpty />;
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <SortableContext
        items={openTabs}
        strategy={horizontalListSortingStrategy}
      >
        <div className="relative flex h-[35px] shrink-0 cursor-default items-stretch overflow-x-auto border-border border-b bg-muted/80 shadow-(--shadow-elevation-sm)">
          {orderedItems.map((item) => (
            <EditorTabItem
              active={isActive(item.href)}
              fileName={item.fileName}
              fileType={item.fileType}
              href={item.href}
              key={item.href}
              onClose={() => closeTab(item.href)}
              onTabClick={openTab}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
