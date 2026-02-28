"use client";

import { useRef } from "react";
import { navItems } from "@/components/ide/config";
import { Breadcrumbs } from "@/components/ide/editor/breadcrumbs";
import { EditorContentContextMenu } from "@/components/ide/editor/editor-content-context-menu";
import { EditorTabs } from "@/components/ide/editor/editor-tabs";
import { SplitEditorView } from "@/components/ide/editor/split-editor-view";
import { copyContentToClipboard } from "@/lib/ide/breadcrumb";
import { cn } from "@/lib/utils";
import { useEditorGroupsStore } from "@/stores/editor-groups-store";
import { useIdeStore } from "@/stores/ide-store";

interface IdeEditorAreaProps {
  children: React.ReactNode;
  pageTitle?: string;
  pathname: string;
}

export function IdeEditorArea({
  children,
  pathname,
  pageTitle = "",
}: IdeEditorAreaProps) {
  const mainRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const editorGroups = useEditorGroupsStore((s) => s.editorGroups);
  const activeGroupIndex = useEditorGroupsStore((s) => s.activeGroupIndex);
  const splitRatio = useEditorGroupsStore((s) => s.splitRatio);
  const viewMode = useIdeStore((s) => s.viewMode);
  const setViewMode = useIdeStore((s) => s.setViewMode);

  const closeTab = useEditorGroupsStore((s) => s.closeTab);
  const closeAllTabs = useEditorGroupsStore((s) => s.closeAllTabs);
  const closeGroup = useEditorGroupsStore((s) => s.closeGroup);
  const closeOtherTabs = useEditorGroupsStore((s) => s.closeOtherTabs);
  const closeTabsToRight = useEditorGroupsStore((s) => s.closeTabsToRight);
  const reorderTabs = useEditorGroupsStore((s) => s.reorderTabs);
  const splitLeft = useEditorGroupsStore((s) => s.splitLeft);
  const splitRight = useEditorGroupsStore((s) => s.splitRight);
  const focusGroup = useEditorGroupsStore((s) => s.focusGroup);
  const moveTabToGroup = useEditorGroupsStore((s) => s.moveTabToGroup);
  const setSplitRatio = useEditorGroupsStore((s) => s.setSplitRatio);

  const hasOpenTabs = editorGroups.some((g) => g.tabs.length > 0);
  const hasSplit = editorGroups.length > 1;
  const activeGroup = editorGroups[activeGroupIndex] ?? editorGroups[0];
  const activeHref =
    activeGroup?.tabs[activeGroup.activeIndex] ?? activeGroup?.tabs[0];

  const copyContent = () =>
    copyContentToClipboard(mainRef, pathname, activeHref, pageTitle, navItems);

  if (hasOpenTabs && hasSplit) {
    return (
      <>
        {/* Mobile: single-pane with active group */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:hidden">
          <EditorTabs
            activeGroupIndex={activeGroupIndex}
            groupIndex={activeGroupIndex}
            onCloseAll={closeAllTabs}
            onCloseOtherTabs={(href) =>
              closeOtherTabs(pathname, activeGroupIndex, href)
            }
            onCloseTab={(href) => closeTab(pathname, activeGroupIndex, href)}
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
            <Breadcrumbs pathname={pathname} />
            <EditorContentContextMenu
              onCopy={copyContent}
              onViewModeChange={setViewMode}
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
          onViewModeChange={setViewMode}
          pathname={pathname}
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
    const group = editorGroups[0];
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <EditorTabs
          activeGroupIndex={0}
          groupIndex={0}
          onCloseAll={closeAllTabs}
          onCloseOtherTabs={(href) => closeOtherTabs(pathname, 0, href)}
          onCloseTab={(href) => closeTab(pathname, 0, href)}
          onCloseTabsToRight={(href) => closeTabsToRight(0, href)}
          onDropFromOtherGroup={(href, src) => moveTabToGroup(0, href, src)}
          onReorder={(order) => reorderTabs(0, order)}
          onSplitLeft={(href) => splitLeft(0, href)}
          onSplitRight={(href) => splitRight(0, href)}
          onTabClick={(href) => focusGroup(0, href)}
          openTabs={group?.tabs ?? []}
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
          <Breadcrumbs pathname={pathname} />
          <EditorContentContextMenu
            onCopy={copyContent}
            onViewModeChange={setViewMode}
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
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <EditorTabs
        activeGroupIndex={0}
        groupIndex={0}
        onCloseAll={closeAllTabs}
        onCloseGroup={
          editorGroups.length > 1 ? (i) => closeGroup(i) : undefined
        }
        onCloseOtherTabs={(href) => closeOtherTabs(pathname, 0, href)}
        onCloseTab={(href) => closeTab(pathname, 0, href)}
        onCloseTabsToRight={(href) => closeTabsToRight(0, href)}
        onReorder={(order) => reorderTabs(0, order)}
        openTabs={[]}
        pathname={pathname}
        totalGroups={editorGroups.length}
      />
    </div>
  );
}
