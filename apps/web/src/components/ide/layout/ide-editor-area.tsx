"use client";

import { cn } from "@portfolio/ui";
import { Breadcrumbs } from "@/components/ide/editor/breadcrumbs";
import { EditorContentContextMenu } from "@/components/ide/editor/editor-content-context-menu";
import { EditorTabs } from "@/components/ide/editor/editor-tabs";
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

  if (hasOpenTabs && hasSplit) {
    return (
      <>
        {/* Mobile: single-pane with active group (split hidden on mobile) */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:hidden">
          <EditorTabs
            activeGroupIndex={activeGroupIndex}
            groupIndex={activeGroupIndex}
            onCloseAll={closeAllTabs}
            onCloseOtherTabs={(href) => closeOtherTabs(activeGroupIndex, href)}
            onCloseTab={(href) => closeTab(activeGroupIndex, href)}
            onCloseTabsToRight={(href) =>
              closeTabsToRight(activeGroupIndex, href)
            }
            onReorder={(order) => reorderTabs(activeGroupIndex, order)}
            onTabClick={(href) => focusGroup(activeGroupIndex, href)}
            openTabs={activeGroup?.tabs ?? []}
            pathname={pathname}
            showSplitButtons={false}
            totalGroups={editorGroups.length}
          />
          <div
            className="flex min-w-0 flex-1 flex-col overflow-hidden outline-none"
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
        </div>
        {/* Desktop: split view */}
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
          groupIndex={0}
          onCloseAll={closeAllTabs}
          onCloseOtherTabs={(href) => closeOtherTabs(0, href)}
          onCloseTab={(href) => closeTab(0, href)}
          onCloseTabsToRight={(href) => closeTabsToRight(0, href)}
          onDropFromOtherGroup={(href, src) => moveTabToGroup(0, href, src)}
          onReorder={(order) => reorderTabs(0, order)}
          onSplitLeft={(href) => splitLeft(0, href)}
          onSplitRight={(href) => splitRight(0, href)}
          onTabClick={(href) => focusGroup(0, href)}
          openTabs={editorGroups[0]?.tabs ?? []}
          pathname={pathname}
          showSplitButtons={true}
          totalGroups={1}
        />
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
              {...(viewMode === "preview" && {
                "data-preview": "",
              })}
            >
              {children}
            </main>
          </EditorContentContextMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <EditorTabs
        onCloseAll={closeAllTabs}
        onCloseGroup={
          editorGroups.length > 1 ? (i) => closeGroup(i) : undefined
        }
        onCloseOtherTabs={(href) => closeOtherTabs(0, href)}
        onCloseTab={(href) => closeTab(0, href)}
        onCloseTabsToRight={(href) => closeTabsToRight(0, href)}
        onReorder={(order) => reorderTabs(0, order)}
        openTabs={[]}
        pathname={pathname}
      />
    </div>
  );
}
