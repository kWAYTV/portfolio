"use client";

import React from "react";
import { GripVertical } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
    },
    []
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      setSplitRatio(Math.max(0.2, Math.min(0.8, ratio)));
    };
    const onMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, setSplitRatio]);

  return (
    <div
      ref={containerRef}
      className="flex hidden min-h-0 flex-1 md:flex"
    >
      {editorGroups.map((group, i) => (
        <React.Fragment key={i}>
          <div
            className="flex min-w-0 flex-col overflow-hidden"
            style={{
              flex: i === 0 ? splitRatio : 1 - splitRatio,
              minWidth: 120,
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
              className="flex w-1 shrink-0 cursor-col-resize items-center justify-center border-border border-x bg-transparent transition-colors hover:bg-muted/40"
              onMouseDown={handleMouseDown}
              role="separator"
            >
              <GripVertical className="size-3.5 text-muted-foreground" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
