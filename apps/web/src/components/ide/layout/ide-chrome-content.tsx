"use client";

/**
 * Pathname-dependent editor chrome (tabs + breadcrumbs). Isolated in Suspense
 * so page content can be static. Uses stores for editor/layout state.
 */
import { usePathname } from "@i18n/routing";
import { Breadcrumbs } from "@/components/ide/editor/breadcrumbs";
import { EditorTabs } from "@/components/ide/editor/editor-tabs";
import { getEditorTabsPropsFromStore } from "@/components/ide/editor/editor-tabs-props";
import { useEditorGroupsStore } from "@/stores/editor-groups-store";
import { useIdeLayoutStore } from "@/stores/ide-layout-store";

export function IdeChromeContent() {
  const pathname = usePathname();
  const editor = useEditorGroupsStore();
  const layout = useIdeLayoutStore();

  const editorGroups = editor.editorGroups;
  const activeGroupIndex = editor.activeGroupIndex;
  const hasOpenTabs = editorGroups.some((g) => g.tabs.length > 0);
  const hasSplit = editorGroups.length > 1;

  const groupIndex = hasSplit ? activeGroupIndex : 0;
  const editorTabsProps = getEditorTabsPropsFromStore(
    pathname,
    groupIndex,
    editor,
    editorGroups,
    { hasSplit, hasOpenTabs, activeGroupIndex }
  );

  const breadcrumbs = (
    <div className="shrink-0 border-border border-b px-2 py-1.5">
      <Breadcrumbs
        onViewModeChange={layout.setViewMode}
        pathname={pathname}
        viewMode={layout.viewMode}
      />
    </div>
  );

  return (
    <>
      <div className="hidden shrink-0 border-border border-b md:block">
        <EditorTabs {...editorTabsProps} />
      </div>
      {hasOpenTabs && breadcrumbs}
    </>
  );
}
