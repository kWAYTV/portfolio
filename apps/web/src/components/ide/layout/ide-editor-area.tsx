"use client";

import { Breadcrumbs } from "@/components/ide/editor/breadcrumbs";
import { EditorTabs } from "@/components/ide/editor/editor-tabs";
import { cn } from "@/lib/utils";
import { useIdeStore } from "@/stores/ide-store";

interface IdeEditorAreaProps {
  children: React.ReactNode;
  pathname: string;
}

export function IdeEditorArea({ children, pathname }: IdeEditorAreaProps) {
  const openTabs = useIdeStore((s) => s.openTabs);
  const viewMode = useIdeStore((s) => s.viewMode);
  const hasOpenTabs = openTabs.length > 0;

  if (!hasOpenTabs) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <EditorTabs pathname={pathname} />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <EditorTabs pathname={pathname} />
      <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden outline-none">
        <Breadcrumbs pathname={pathname} />
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
