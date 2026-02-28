"use client";

import { useRef } from "react";
import { navItems } from "@/components/ide/config";
import { Breadcrumbs } from "@/components/ide/editor/breadcrumbs";
import { EditorContentContextMenu } from "@/components/ide/editor/editor-content-context-menu";
import { EditorTabs } from "@/components/ide/editor/editor-tabs";
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
  const viewMode = useIdeStore((s) => s.viewMode);
  const setViewMode = useIdeStore((s) => s.setViewMode);

  const closeTab = useEditorGroupsStore((s) => s.closeTab);
  const closeAllTabs = useEditorGroupsStore((s) => s.closeAllTabs);
  const closeOtherTabs = useEditorGroupsStore((s) => s.closeOtherTabs);
  const closeTabsToRight = useEditorGroupsStore((s) => s.closeTabsToRight);
  const reorderTabs = useEditorGroupsStore((s) => s.reorderTabs);

  const group = editorGroups[0];
  const hasOpenTabs = group?.tabs?.length > 0;
  const activeHref = group?.tabs?.[group.activeIndex] ?? group?.tabs?.[0];

  const copyContent = () =>
    copyContentToClipboard(mainRef, pathname, activeHref, pageTitle, navItems);

  if (hasOpenTabs) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <EditorTabs
          onCloseAll={closeAllTabs}
          onCloseOtherTabs={(href) => closeOtherTabs(pathname, 0, href)}
          onCloseTab={(href) => closeTab(pathname, 0, href)}
          onCloseTabsToRight={(href) => closeTabsToRight(0, href)}
          onReorder={(order) => reorderTabs(0, order)}
          openTabs={group?.tabs ?? []}
          pathname={pathname}
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
        onCloseAll={closeAllTabs}
        onCloseOtherTabs={(href) => closeOtherTabs(pathname, 0, href)}
        onCloseTab={(href) => closeTab(pathname, 0, href)}
        onCloseTabsToRight={(href) => closeTabsToRight(0, href)}
        onReorder={(order) => reorderTabs(0, order)}
        openTabs={[]}
        pathname={pathname}
      />
    </div>
  );
}
