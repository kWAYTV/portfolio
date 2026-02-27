"use client";

import { cn } from "@portfolio/ui";
import { Breadcrumbs } from "@/components/ide/editor/breadcrumbs";
import { EditorContentContextMenu } from "@/components/ide/editor/editor-content-context-menu";
import { EditorTabs } from "@/components/ide/editor/editor-tabs";
import { getEditorTabsPropsFromCallbacks } from "@/components/ide/editor/editor-tabs-props";
import { SplitEditorView } from "@/components/ide/editor/split-editor-view";
import type { EditorGroup } from "@/components/ide/shared/split-editor-types";
import type { ViewMode } from "@/components/ide/shared/view-mode";

interface IdeEditorAreaProps {
  activeGroupIndex: number;
  children: React.ReactNode;
  closeAllTabs: () => void;
  closeGroup: (groupIndex: number) => void;
  closeOtherTabs: (groupIndex: number, href: string) => void;
  closeTab: (groupIndex: number, href: string) => void;
  closeTabsToRight: (groupIndex: number, href: string) => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
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
  pageTitle: string;
  pathname: string;
  reorderTabs: (groupIndex: number, order: string[]) => void;
  setSplitRatio: (ratio: number) => void;
  splitLeft: (groupIndex: number, href: string) => void;
  splitRatio: number;
  splitRight: (groupIndex: number, href: string) => void;
  viewMode: ViewMode;
}

function EditorContentArea({
  children,
  contentRef,
  copyContent,
  mainRef,
  onViewModeChange,
  pageTitle,
  pathname,
  viewMode,
}: {
  children: React.ReactNode;
  contentRef: React.RefObject<HTMLDivElement | null>;
  copyContent: () => void;
  mainRef: React.RefObject<HTMLElement | null>;
  onViewModeChange: (mode: ViewMode) => void;
  pageTitle: string;
  pathname: string;
  viewMode: ViewMode;
}) {
  return (
    <div
      className="flex w-full min-w-0 flex-1 flex-col overflow-hidden outline-none"
      ref={contentRef}
      tabIndex={-1}
    >
      <span aria-hidden className="sr-only">
        {pageTitle}
      </span>
      <Breadcrumbs
        onViewModeChange={onViewModeChange}
        pathname={pathname}
        viewMode={viewMode}
      />
      <EditorContentContextMenu
        onCopy={copyContent}
        onViewModeChange={onViewModeChange}
        viewMode={viewMode}
      >
        <main
          className={cn(
            "min-h-0 w-full min-w-0 flex-1 overflow-y-auto",
            viewMode === "preview" && "min-h-full"
          )}
          data-ide-main
          ref={mainRef}
          {...(viewMode === "preview" && { "data-preview": "" })}
        >
          {children}
        </main>
      </EditorContentContextMenu>
    </div>
  );
}

export function IdeEditorArea({
  activeGroupIndex,
  children,
  closeAllTabs,
  closeGroup,
  closeOtherTabs,
  closeTab,
  closeTabsToRight,
  contentRef,
  copyContent,
  editorGroups,
  focusGroup,
  mainRef,
  moveTabToGroup,
  onViewModeChange,
  pageTitle,
  pathname,
  reorderTabs,
  setSplitRatio,
  splitLeft,
  splitRatio,
  splitRight,
  viewMode,
}: IdeEditorAreaProps) {
  const hasOpenTabs = editorGroups.some((g) => g.tabs.length > 0);
  const hasSplit = editorGroups.length > 1;
  const activeGroup = editorGroups[activeGroupIndex] ?? editorGroups[0];

  const callbacks = {
    closeAllTabs,
    closeGroup,
    closeOtherTabs,
    closeTab,
    closeTabsToRight,
    focusGroup,
    moveTabToGroup,
    reorderTabs,
    splitLeft,
    splitRight,
  };

  if (hasOpenTabs && hasSplit) {
    return (
      <>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:hidden">
          <EditorTabs
            {...getEditorTabsPropsFromCallbacks(
              pathname,
              activeGroupIndex,
              callbacks,
              editorGroups,
              { hasSplit, hasOpenTabs, activeGroupIndex }
            )}
          />
          <EditorContentArea
            contentRef={contentRef}
            copyContent={copyContent}
            mainRef={mainRef}
            onViewModeChange={onViewModeChange}
            pageTitle={pageTitle}
            pathname={pathname}
            viewMode={viewMode}
          >
            {children}
          </EditorContentArea>
        </div>
        <SplitEditorView
          activeGroupIndex={activeGroupIndex}
          closeAllTabs={closeAllTabs}
          closeGroup={closeGroup}
          closeOtherTabs={closeOtherTabs}
          closeTab={closeTab}
          closeTabsToRight={closeTabsToRight}
          copyContent={copyContent}
          editorGroups={editorGroups}
          focusGroup={focusGroup}
          mainRef={mainRef}
          moveTabToGroup={moveTabToGroup}
          onViewModeChange={onViewModeChange}
          reorderTabs={reorderTabs}
          setSplitRatio={setSplitRatio}
          splitLeft={splitLeft}
          splitRatio={splitRatio}
          splitRight={splitRight}
          viewMode={viewMode}
        >
          {children}
        </SplitEditorView>
      </>
    );
  }

  if (hasOpenTabs) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <EditorTabs
          {...getEditorTabsPropsFromCallbacks(
            pathname,
            0,
            callbacks,
            editorGroups,
            { hasSplit, hasOpenTabs }
          )}
        />
        <EditorContentArea
          contentRef={contentRef}
          copyContent={copyContent}
          mainRef={mainRef}
          onViewModeChange={onViewModeChange}
          pageTitle={pageTitle}
          pathname={pathname}
          viewMode={viewMode}
        >
          {children}
        </EditorContentArea>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <EditorTabs
        {...getEditorTabsPropsFromCallbacks(
          pathname,
          0,
          callbacks,
          editorGroups,
          { hasSplit, hasOpenTabs }
        )}
      />
    </div>
  );
}
