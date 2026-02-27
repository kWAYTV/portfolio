"use client";

import { usePathname, useRouter } from "@i18n/routing";
import { TooltipProvider } from "@portfolio/ui";
import dynamic from "next/dynamic";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Suspense, useMemo, useRef } from "react";
import { useCommits } from "@/components/ide/commits-provider";
import { IdeChromeShell } from "@/components/ide/layout/ide-chrome-shell";
import { IdeEditorArea } from "@/components/ide/layout/ide-editor-area";
import { IdeLayoutEmbed } from "@/components/ide/layout/ide-layout-embed";
import { PageContentSkeleton } from "@/components/ide/layout/page-content-skeleton";
import { ViewModeProvider } from "@/components/ide/shared/view-mode";
import { TerminalPanel } from "@/components/ide/terminal/terminal-panel";
import { navItems } from "@/consts/nav-items";
import { useIdeChromeEffects } from "@/hooks/use-ide-chrome-effects";
import { useIdeKeyboardShortcuts } from "@/hooks/use-ide-keyboard-shortcuts";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { copyContentToClipboard } from "@/lib/ide/breadcrumb";
import { useEditorGroupsStore } from "@/stores/editor-groups-store";
import { useIdeLayoutStore } from "@/stores/ide-layout-store";

const CommandPalette = dynamic(
  () =>
    import("@/components/ide/command/command-palette").then((m) => ({
      default: m.CommandPalette,
    })),
  { ssr: false }
);

interface IdeLayoutProps {
  children: React.ReactNode;
}

export function IdeLayout({ children }: IdeLayoutProps) {
  const { commits, fetchCommits, isLoading: isRefreshing } = useCommits();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [embed] = useQueryState("embed", parseAsBoolean.withDefault(false));
  const isEmbed = embed;
  const contentRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const layout = useIdeLayoutStore();
  const editor = useEditorGroupsStore();

  useIdeChromeEffects({ pathname, router, fetchCommits });

  const activeHref = useEditorGroupsStore((s) => {
    const g = s.editorGroups[s.activeGroupIndex];
    return g?.tabs[g.activeIndex] ?? g?.tabs[0];
  });

  useIdeKeyboardShortcuts({
    contentRef,
    onToggleSidebar: layout.toggleSidebar,
    onToggleTerminal: layout.toggleTerminal,
  });

  const copyContent = () =>
    copyContentToClipboard(
      mainRef,
      pathname,
      activeHref,
      layout.pageTitle,
      navItems
    );

  const viewModeValue = useMemo(
    () => ({ viewMode: layout.viewMode, setViewMode: layout.setViewMode }),
    [layout.viewMode, layout.setViewMode]
  );

  const handleFocusSourceControl = () => layout.focusSourceControl(isMobile);

  if (isEmbed) {
    return <IdeLayoutEmbed>{children}</IdeLayoutEmbed>;
  }

  return (
    <ViewModeProvider value={viewModeValue}>
      <TooltipProvider delayDuration={300}>
        <CommandPalette
          onOpenChange={layout.setCommandOpen}
          onToggleSidebar={layout.toggleSidebar}
          onToggleTerminal={layout.toggleTerminal}
          open={layout.commandOpen}
          sidebarOpen={layout.sidebarOpen}
          terminalOpen={layout.terminalOpen}
        />
        <IdeChromeShell
          commits={commits}
          contentSlot={
            <>
              <IdeEditorArea
                activeGroupIndex={editor.activeGroupIndex}
                closeAllTabs={editor.closeAllTabs}
                closeGroup={editor.closeGroup}
                closeOtherTabs={(gi, href) =>
                  editor.closeOtherTabs(pathname, gi, href)
                }
                closeTab={(gi, href) => editor.closeTab(pathname, gi, href)}
                closeTabsToRight={(gi, href) =>
                  editor.closeTabsToRight(gi, href)
                }
                contentRef={contentRef}
                copyContent={copyContent}
                editorGroups={editor.editorGroups}
                focusGroup={editor.focusGroup}
                mainRef={mainRef}
                moveTabToGroup={editor.moveTabToGroup}
                onViewModeChange={layout.setViewMode}
                pageTitle={layout.pageTitle}
                pathname={pathname}
                reorderTabs={editor.reorderTabs}
                setSplitRatio={editor.setSplitRatio}
                splitLeft={editor.splitLeft}
                splitRatio={editor.splitRatio}
                splitRight={editor.splitRight}
                viewMode={layout.viewMode}
              >
                <Suspense fallback={<PageContentSkeleton />}>
                  {children}
                </Suspense>
              </IdeEditorArea>
              <TerminalPanel
                isOpen={layout.terminalOpen}
                onClose={() => layout.setTerminalOpen(false)}
              />
            </>
          }
          fetchCommits={fetchCommits}
          isRefreshing={isRefreshing}
          layout="flex"
          onFocusSourceControl={handleFocusSourceControl}
          pathname={pathname}
        />
      </TooltipProvider>
    </ViewModeProvider>
  );
}
