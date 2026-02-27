"use client";

import { usePathname } from "@i18n/routing";
import { Sheet, SheetContent, TooltipProvider } from "@portfolio/ui";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { navItems } from "@/consts/nav-items";
import { useEditorGroups } from "@/hooks/use-editor-groups";
import { useIdeKeyboardShortcuts } from "@/hooks/use-ide-keyboard-shortcuts";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { getBreadcrumbPath } from "@/lib/ide/breadcrumb";
import { ActivityBar } from "@/components/ide/layout/activity-bar";
import { CommandPalette } from "@/components/ide/command/command-palette";
import { IdeEditorArea } from "@/components/ide/layout/ide-editor-area";
import { IdeLayoutEmbed } from "@/components/ide/layout/ide-layout-embed";
import { MobileActivityBar } from "@/components/ide/layout/mobile-activity-bar";
import { MobileMenu } from "@/components/ide/layout/mobile-menu";
import { Sidebar } from "@/components/ide/sidebar/sidebar";
import { SourceControlView } from "@/components/ide/sidebar/source-control-view";
import { StatusBar } from "@/components/ide/layout/status-bar";
import { TerminalPanel } from "@/components/ide/terminal/terminal-panel";
import { TitleBar } from "@/components/ide/layout/title-bar";
import { type ViewMode, ViewModeProvider } from "@/components/ide/shared/view-mode";
import type { GitCommitItem } from "@/lib/github";
import type { SidebarView } from "@/components/ide/shared/ide-types";

interface IdeLayoutProps {
  children: React.ReactNode;
  commits?: GitCommitItem[];
}

export function IdeLayout({ children, commits = [] }: IdeLayoutProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [embed] = useQueryState("embed", parseAsBoolean.withDefault(false));
  const isEmbed = embed;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarView, setSidebarView] = useState<SidebarView>("explorer");
  const [mobileSidebarView, setMobileSidebarView] = useState<
    SidebarView | null
  >(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");

  const {
    activeGroupIndex,
    activeHref,
    closeAllTabs,
    closeGroup,
    closeOtherTabs,
    closeTab,
    closeTabsToRight,
    editorGroups,
    focusGroup,
    moveTabToGroup,
    openTab,
    reorderTabs,
    setSplitRatio,
    splitLeft,
    splitRatio,
    splitRight,
  } = useEditorGroups(pathname);

  const contentRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const toggleTerminal = useCallback(() => {
    setTerminalOpen((prev) => !prev);
  }, []);

  const openMobileExplorer = useCallback(() => {
    setMobileSidebarView("explorer");
  }, []);

  const openMobileSourceControl = useCallback(() => {
    setMobileSidebarView("sourceControl");
  }, []);

  useIdeKeyboardShortcuts({
    contentRef,
    onToggleSidebar: toggleSidebar,
    onToggleTerminal: toggleTerminal,
  });

  useEffect(() => {
    setPageTitle(typeof document !== "undefined" ? document.title : "");
  }, []);

  useEffect(() => {
    setMobileSidebarView(null);
  }, [pathname]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen not supported or denied
    }
  }, []);

  const copyContent = useCallback(() => {
    const path = activeHref ?? pathname;
    const title =
      pageTitle || (typeof document !== "undefined" ? document.title : "");
    const breadcrumb = getBreadcrumbPath(path, navItems);
    const mainText = mainRef.current?.innerText ?? "";
    const formatted = [title, breadcrumb, mainText]
      .filter(Boolean)
      .join("\n\n");
    void navigator.clipboard.writeText(formatted);
  }, [pathname, pageTitle, activeHref]);

  const hasOpenTabs = editorGroups.some((g) => g.tabs.length > 0);
  const hasSplit = editorGroups.length > 1;

  const viewModeValue = useMemo(() => ({ viewMode, setViewMode }), [viewMode]);

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
            leftSlot={
              <MobileMenu
                onOpenCommand={() => setCommandOpen(true)}
                onOpenExplorer={openMobileExplorer}
                onOpenSourceControl={openMobileSourceControl}
                onToggleTerminal={toggleTerminal}
                pathname={pathname}
                terminalOpen={terminalOpen}
              />
            }
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
                closeOtherTabs={closeOtherTabs}
                closeTab={closeTab}
                closeTabsToRight={closeTabsToRight}
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
            onFocusSourceControl={() => {
              if (isMobile) {
                setMobileSidebarView("sourceControl");
              } else {
                setSidebarView("sourceControl");
                setSidebarOpen(true);
              }
            }}
            onToggleTerminal={toggleTerminal}
            pathname={pathname}
            terminalOpen={terminalOpen}
          />

          {/* Mobile: sidebar views in Sheet (Explorer / Source Control) */}
          <Sheet
            onOpenChange={(open) => !open && setMobileSidebarView(null)}
            open={mobileSidebarView !== null}
          >
            <SheetContent
              className="flex h-full w-full max-w-full flex-col gap-0 overflow-hidden p-0 md:hidden"
              onOpenAutoFocus={(e) => e.preventDefault()}
              showCloseButton={true}
              side="left"
            >
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden pr-12">
                {mobileSidebarView === "sourceControl" ? (
                  <SourceControlView commits={commits} />
                ) : mobileSidebarView === "explorer" ? (
                  <Sidebar onOpenTab={openTab} pathname={pathname} />
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </TooltipProvider>
    </ViewModeProvider>
  );
}
