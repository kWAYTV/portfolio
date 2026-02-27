"use client";

import { Breadcrumbs } from "@/components/ide/editor/breadcrumbs";
import { EditorTabs } from "@/components/ide/editor/editor-tabs";
import type { ViewMode } from "@/components/ide/shared/view-mode";
import { cn } from "@/lib/utils";

interface IdeEditorAreaProps {
  children: React.ReactNode;
  closeAllTabs: () => void;
  closeTab: (href: string) => void;
  onTabClick?: (href: string) => void;
  onViewModeChange: (mode: ViewMode) => void;
  openTabs: string[];
  pathname: string;
  viewMode: ViewMode;
}

export function IdeEditorArea({
  children,
  closeAllTabs,
  closeTab,
  openTabs,
  pathname,
  viewMode,
  onTabClick,
  onViewModeChange,
}: IdeEditorAreaProps) {
  const hasOpenTabs = openTabs.length > 0;

  if (!hasOpenTabs) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <EditorTabs
          onCloseAll={closeAllTabs}
          onCloseTab={closeTab}
          openTabs={[]}
          pathname={pathname}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <EditorTabs
        onCloseAll={closeAllTabs}
        onCloseTab={closeTab}
        onTabClick={onTabClick}
        openTabs={openTabs}
        pathname={pathname}
      />
      <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden outline-none">
        <Breadcrumbs
          onViewModeChange={onViewModeChange}
          pathname={pathname}
          viewMode={viewMode}
        />
        <main
          className={cn(
            "min-h-0 w-full min-w-0 flex-1 overflow-y-auto",
            viewMode === "preview" && "min-h-full"
          )}
          data-ide-main
          data-preview={viewMode === "preview" ? "" : undefined}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
