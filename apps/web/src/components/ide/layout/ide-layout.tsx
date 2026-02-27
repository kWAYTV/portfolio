"use client";

import { usePathname, useRouter } from "@i18n/routing";
import { Sheet, SheetContent, TooltipProvider } from "@portfolio/ui";
import dynamic from "next/dynamic";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { PageContentSkeleton } from "@/components/ide/layout/page-content-skeleton";
import { ActivityBar } from "@/components/ide/layout/activity-bar";
import { IdeEditorArea } from "@/components/ide/layout/ide-editor-area";
import { IdeLayoutEmbed } from "@/components/ide/layout/ide-layout-embed";
import { MobileActivityBar } from "@/components/ide/layout/mobile-activity-bar";
import { MobileMenu } from "@/components/ide/layout/mobile-menu";
import { StatusBar } from "@/components/ide/layout/status-bar";
import { TitleBar } from "@/components/ide/layout/title-bar";
import { ViewModeProvider } from "@/components/ide/shared/view-mode";
import { Sidebar } from "@/components/ide/sidebar/sidebar";
import { SourceControlView } from "@/components/ide/sidebar/source-control-view";
import { TerminalPanel } from "@/components/ide/terminal/terminal-panel";
import { navItems } from "@/consts/nav-items";
import { useIdeKeyboardShortcuts } from "@/hooks/use-ide-keyboard-shortcuts";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useCommits } from "@/components/ide/commits-provider";
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

  const activeHref = useEditorGroupsStore((s) => {
    const g = s.editorGroups[s.activeGroupIndex];
    return g?.tabs[g.activeIndex] ?? g?.tabs[0];
  });

  useEffect(() => {
    useEditorGroupsStore.getState().setRouter(router);
    return () => useEditorGroupsStore.getState().setRouter(null);
  }, [router]);

  useEffect(() => {
    useEditorGroupsStore.getState().syncFromPathname(pathname);
  }, [pathname]);

  useEffect(() => {
    useIdeLayoutStore
      .getState()
      .setPageTitle(typeof document !== "undefined" ? document.title : "");
  }, []);

  useEffect(() => {
    useIdeLayoutStore.getState().setMobileSidebarView(null);
  }, [pathname]);

  useEffect(() => {
    const onFullscreenChange = () => {
      useIdeLayoutStore
        .getState()
        .setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

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
        <div className="flex h-dvh flex-col overflow-hidden bg-background">
          <TitleBar
            leftSlot={<MobileMenu pathname={pathname} />}
            maximized={layout.isFullscreen}
            onClose={() => editor.closeAllTabs()}
            onMaximize={layout.toggleFullscreen}
            onMinimize={
              layout.isFullscreen
                ? layout.toggleFullscreen
                : layout.toggleSidebar
            }
          />

          <div className="flex min-h-0 flex-1">
            <div className="hidden md:block">
              <ActivityBar
                onOpenCommand={() => layout.setCommandOpen(true)}
                onToggleSidebar={layout.toggleSidebar}
                onToggleSidebarView={layout.setSidebarView}
                onToggleTerminal={layout.toggleTerminal}
                pathname={pathname}
                sidebarOpen={layout.sidebarOpen}
                sidebarView={layout.sidebarView}
                terminalOpen={layout.terminalOpen}
              />
            </div>

            {layout.sidebarOpen && (
              <div className="hidden md:block">
                {layout.sidebarView === "sourceControl" ? (
                  <SourceControlView
                    commits={commits}
                    isSyncing={isRefreshing}
                    onSync={fetchCommits}
                  />
                ) : (
                  <Sidebar onOpenTab={editor.openTab} pathname={pathname} />
                )}
              </div>
            )}

            <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden">
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
            </div>
          </div>

          <MobileActivityBar
            onOpenExplorer={layout.openMobileExplorer}
            onOpenSourceControl={layout.openMobileSourceControl}
            onToggleTerminal={layout.toggleTerminal}
            terminalOpen={layout.terminalOpen}
          />

          <StatusBar
            onFocusSourceControl={handleFocusSourceControl}
            onToggleTerminal={layout.toggleTerminal}
            pathname={pathname}
            terminalOpen={layout.terminalOpen}
          />

          <Sheet
            onOpenChange={(open) => !open && layout.setMobileSidebarView(null)}
            open={layout.mobileSidebarView !== null}
          >
            <SheetContent
              className="flex h-full w-full max-w-full flex-col gap-0 overflow-hidden p-0 md:hidden"
              onOpenAutoFocus={(e) => e.preventDefault()}
              showCloseButton={false}
              side="left"
            >
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {layout.mobileSidebarView === "sourceControl" ? (
                  <SourceControlView
                    commits={commits}
                    fullWidth
                    isSyncing={isRefreshing}
                    onClose={() => layout.setMobileSidebarView(null)}
                    onSync={fetchCommits}
                  />
                ) : layout.mobileSidebarView === "explorer" ? (
                  <Sidebar
                    fullWidth
                    onClose={() => layout.setMobileSidebarView(null)}
                    onOpenTab={editor.openTab}
                    pathname={pathname}
                  />
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </TooltipProvider>
    </ViewModeProvider>
  );
}
