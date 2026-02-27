"use client";

import React from "react";
import { EditorPane } from "@/components/ide/editor/editor-pane";
import { SplitDivider } from "@/components/ide/editor/split-divider";
import type { EditorGroup } from "@/components/ide/shared/split-editor-types";
import type { ViewMode } from "@/components/ide/shared/view-mode";
import { useSplitResize } from "@/hooks/use-split-resize";

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
  moveTabToGroup: (
    targetGroupIndex: number,
    href: string,
    sourceGroupIndex: number
  ) => void;
  onViewModeChange: (mode: ViewMode) => void;
  reorderTabs: (groupIndex: number, newOrder: string[]) => void;
  setSplitRatio: (ratio: number) => void;
  splitLeft: (groupIndex: number, href: string) => void;
  splitRatio: number;
  splitRight: (groupIndex: number, href: string) => void;
  viewMode: ViewMode;
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
  const {
    containerRef,
    draggingDividerIndex,
    handlePointerDown,
    hoveredDividerIndex,
    setHoveredDividerIndex,
  } = useSplitResize({ setSplitRatio });

  return (
    <div
      className="flex hidden min-h-0 min-w-0 flex-1 md:flex"
      ref={containerRef}
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
              onViewModeChange={onViewModeChange}
              totalGroups={editorGroups.length}
              viewMode={viewMode}
            >
              {i === activeGroupIndex ? children : undefined}
            </EditorPane>
          </div>
          {i < editorGroups.length - 1 && (
            <SplitDivider
              isActive={hoveredDividerIndex === i || draggingDividerIndex === i}
              onPointerDown={handlePointerDown(i)}
              onPointerEnter={() => setHoveredDividerIndex(i)}
              onPointerLeave={() => setHoveredDividerIndex(null)}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
