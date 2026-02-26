"use client";

import React from "react";
import { GripVertical } from "lucide-react";
import { useCallback, useRef } from "react";
import { EditorPane } from "./editor-pane";
import type { EditorGroup } from "./split-editor-types";
import type { ViewMode } from "./view-mode";

interface SplitEditorViewProps {
  activeGroupIndex: number;
  children: React.ReactNode;
  closeAllTabs: (groupIndex?: number) => void;
  closeGroup: (groupIndex: number) => void;
  closeOtherTabs: (groupIndex: number, href: string) => void;
  closeTab: (groupIndex: number, href: string) => void;
  closeTabsToRight: (groupIndex: number, href: string) => void;
  copyContent: () => void;
  editorGroups: EditorGroup[];
  focusGroup: (groupIndex: number, href?: string) => void;
  mainRef: React.RefObject<HTMLElement | null>;
  moveTabToGroup: (targetGroupIndex: number, href: string, sourceGroupIndex: number) => void;
  reorderTabs: (groupIndex: number, newOrder: string[]) => void;
  setSplitRatio: (ratio: number) => void;
  splitLeft: (groupIndex: number, href: string) => void;
  splitRatio: number;
  splitRight: (groupIndex: number, href: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function SplitEditorView({
  activeGroupIndex,
  children,
  closeAllTabs,
  closeGroup,
  closeOtherTabs,
  closeTab,
  closeTabsToRight,
  copyContent,
  editorGroups,
  focusGroup,
  mainRef,
  moveTabToGroup,
  reorderTabs,
  setSplitRatio,
  splitLeft,
  splitRatio,
  splitRight,
  viewMode,
  onViewModeChange,
}: SplitEditorViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onPointerMove = (moveEvent: PointerEvent) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const ratio = (moveEvent.clientX - rect.left) / rect.width;
        setSplitRatio(Math.max(0.2, Math.min(0.8, ratio)));
      };

      const onPointerUp = () => {
        target.releasePointerCapture(e.pointerId);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        target.removeEventListener("pointermove", onPointerMove);
        target.removeEventListener("pointerup", onPointerUp);
      };

      target.addEventListener("pointermove", onPointerMove);
      target.addEventListener("pointerup", onPointerUp);
    },
    [setSplitRatio]
  );

  return (
    <div
      ref={containerRef}
      className="flex hidden min-h-0 min-w-0 flex-1 md:flex"
    >
      {editorGroups.map((group, i) => (
        <React.Fragment key={i}>
          <div
            className="flex min-w-[120px] flex-col overflow-hidden"
            style={{
              flex: `${i === 0 ? splitRatio : 1 - splitRatio} 1 0`,
            }}
          >
            <EditorPane
              group={group}
              groupIndex={i}
              isActiveGroup={i === activeGroupIndex}
              mainRef={i === activeGroupIndex ? mainRef : undefined}
              onCloseAll={closeAllTabs}
              onCloseGroup={closeGroup}
              onCloseOtherTabs={closeOtherTabs}
              onCloseTab={closeTab}
              onCloseTabsToRight={closeTabsToRight}
              onCopy={copyContent}
              onDropFromOtherGroup={(href, src) => moveTabToGroup(i, href, src)}
              onFocusGroup={focusGroup}
              onReorder={reorderTabs}
              onSplitLeft={splitLeft}
              onSplitRight={splitRight}
              totalGroups={editorGroups.length}
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            >
              {i === activeGroupIndex ? children : undefined}
            </EditorPane>
          </div>
          {i < editorGroups.length - 1 && (
            <div
              className="flex w-2 shrink-0 cursor-col-resize items-center justify-center border-border border-x bg-muted/30 transition-colors hover:bg-muted/60"
              onPointerDown={handlePointerDown}
              role="separator"
              title="Drag to resize"
            >
              <GripVertical className="size-4 text-muted-foreground" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
