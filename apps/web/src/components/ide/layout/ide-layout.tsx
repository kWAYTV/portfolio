"use client";

import { usePathname, useRouter } from "@i18n/routing";
import { Sheet, SheetContent, TooltipProvider } from "@portfolio/ui";
import dynamic from "next/dynamic";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect, useMemo, useRef } from "react";
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
import type { GitCommitItem } from "@/lib/github";
import { copyContentToClipboard } from "@/lib/ide/breadcrumb";
import { useIdeStore } from "@/stores/ide-store";

const CommandPalette = dynamic(
  () =>
    import("@/components/ide/command/command-palette").then((m) => ({
      default: m.CommandPalette,
    })),
  { ssr: false }
);

interface IdeLayoutProps {
  children: React.ReactNode;
  commits?: GitCommitItem[];
}

export function IdeLayout({ children, commits = [] }: IdeLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [embed] = useQueryState("embed", parseAsBoolean.withDefault(false));
  const isEmbed = embed;
  const contentRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const {
    activeGroupIndex,
    editorGroups,
    splitRatio,
    sidebarOpen,
    sidebarView,
    terminalOpen,
    commandOpen,
    viewMode,
    pageTitle,
    mobileSidebarView,
    isFullscreen,
    setRouter,
    setPageTitle,
    setCommandOpen,
    setMobileSidebarView,
    setSidebarView,
    setViewMode,
    setTerminalOpen,
    syncFromPathname,
    setIsFullscreen,
    toggleSidebar,
    toggleTerminal,
    toggleFullscreen,
    openTab,
    openMobileExplorer,
    openMobileSourceControl,
    focusSourceControl,
  } = useIdeStore();

  const closeTab = useIdeStore((s) => s.closeTab);
  const closeAllTabs = useIdeStore((s) => s.closeAllTabs);
  const closeGroup = useIdeStore((s) => s.closeGroup);
  const closeOtherTabs = useIdeStore((s) => s.closeOtherTabs);
  const closeTabsToRight = useIdeStore((s) => s.closeTabsToRight);
  const reorderTabs = useIdeStore((s) => s.reorderTabs);
  const splitLeft = useIdeStore((s) => s.splitLeft);
  const splitRight = useIdeStore((s) => s.splitRight);
  const focusGroup = useIdeStore((s) => s.focusGroup);
  const moveTabToGroup = useIdeStore((s) => s.moveTabToGroup);
  const setSplitRatio = useIdeStore((s) => s.setSplitRatio);

  const activeHref = useIdeStore((s) => {
    const g = s.editorGroups[s.activeGroupIndex];
    return g?.tabs[g.activeIndex] ?? g?.tabs[0];
  });

  useEffect(() => {
    setRouter(router);
    return () => setRouter(null);
  }, [router, setRouter]);

  useEffect(() => {
    syncFromPathname(pathname);
  }, [pathname, syncFromPathname]);

  useEffect(() => {
    setPageTitle(typeof document !== "undefined" ? document.title : "");
  }, [setPageTitle]);

  useEffect(() => {
    setMobileSidebarView(null);
  }, [pathname, setMobileSidebarView]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [setIsFullscreen]);

  useIdeKeyboardShortcuts({
    contentRef,
    onToggleSidebar: toggleSidebar,
    onToggleTerminal: toggleTerminal,
  });

  const copyContent = () =>
    copyContentToClipboard(mainRef, pathname, activeHref, pageTitle, navItems);

  const viewModeValue = useMemo(
    () => ({ viewMode, setViewMode }),
    [viewMode, setViewMode]
  );

  const handleFocusSourceControl = () => focusSourceControl(isMobile);

  if (isEmbed) {
    return <IdeLayoutEmbed>{children}</IdeLayoutEmbed>;
  }

  return (
    <ViewModeProvider value={viewModeValue}>
      <TooltipProvider delayDuration={300}>
        <CommandPalette
          onOpenChange={setCommandOpen}
          onToggleSidebar={toggleSidebar}
          onToggleTerminal={toggleTerminal}
          open={commandOpen}
          sidebarOpen={sidebarOpen}
          terminalOpen={terminalOpen}
        />
        <div className="flex h-dvh flex-col overflow-hidden bg-background">
          <TitleBar
            leftSlot={<MobileMenu pathname={pathname} />}
            maximized={isFullscreen}
            onClose={() => closeAllTabs()}
            onMaximize={toggleFullscreen}
            onMinimize={isFullscreen ? toggleFullscreen : toggleSidebar}
          />

          <div className="flex min-h-0 flex-1">
            <div className="hidden md:block">
              <ActivityBar
                onOpenCommand={() => setCommandOpen(true)}
                onToggleSidebar={toggleSidebar}
                onToggleSidebarView={setSidebarView}
                onToggleTerminal={toggleTerminal}
                pathname={pathname}
                sidebarOpen={sidebarOpen}
                sidebarView={sidebarView}
                terminalOpen={terminalOpen}
              />
            </div>

            {sidebarOpen && (
              <div className="hidden md:block">
                {sidebarView === "sourceControl" ? (
                  <SourceControlView commits={commits} />
                ) : (
                  <Sidebar onOpenTab={openTab} pathname={pathname} />
                )}
              </div>
            )}

            <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden">
              <IdeEditorArea
                activeGroupIndex={activeGroupIndex}
                closeAllTabs={closeAllTabs}
                closeGroup={closeGroup}
                closeOtherTabs={(gi, href) =>
                  closeOtherTabs(pathname, gi, href)
                }
                closeTab={(gi, href) => closeTab(pathname, gi, href)}
                closeTabsToRight={(gi, href) => closeTabsToRight(gi, href)}
                contentRef={contentRef}
                copyContent={copyContent}
                editorGroups={editorGroups}
                focusGroup={focusGroup}
                mainRef={mainRef}
                moveTabToGroup={moveTabToGroup}
                onViewModeChange={setViewMode}
                pageTitle={pageTitle}
                pathname={pathname}
                reorderTabs={reorderTabs}
                setSplitRatio={setSplitRatio}
                splitLeft={splitLeft}
                splitRatio={splitRatio}
                splitRight={splitRight}
                viewMode={viewMode}
              >
                {children}
              </IdeEditorArea>
              <TerminalPanel
                isOpen={terminalOpen}
                onClose={() => setTerminalOpen(false)}
              />
            </div>
          </div>

          <MobileActivityBar
            onOpenExplorer={openMobileExplorer}
            onOpenSourceControl={openMobileSourceControl}
            onToggleTerminal={toggleTerminal}
            terminalOpen={terminalOpen}
          />

          <StatusBar
            onFocusSourceControl={handleFocusSourceControl}
            onToggleTerminal={toggleTerminal}
            pathname={pathname}
            terminalOpen={terminalOpen}
          />

          <Sheet
            onOpenChange={(open) => !open && setMobileSidebarView(null)}
            open={mobileSidebarView !== null}
          >
            <SheetContent
              className="flex h-full w-full max-w-full flex-col gap-0 overflow-hidden p-0 md:hidden"
              onOpenAutoFocus={(e) => e.preventDefault()}
              showCloseButton={false}
              side="left"
            >
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {mobileSidebarView === "sourceControl" ? (
                  <SourceControlView
                    commits={commits}
                    fullWidth
                    onClose={() => setMobileSidebarView(null)}
                  />
                ) : mobileSidebarView === "explorer" ? (
                  <Sidebar
                    fullWidth
                    onClose={() => setMobileSidebarView(null)}
                    onOpenTab={openTab}
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
