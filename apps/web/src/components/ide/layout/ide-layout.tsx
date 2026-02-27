"use client";

import { usePathname } from "@i18n/routing";
import { Sheet, SheetContent, TooltipProvider } from "@portfolio/ui";
import dynamic from "next/dynamic";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useMemo, useRef } from "react";

const CommandPalette = dynamic(
  () =>
    import("@/components/ide/command/command-palette").then((m) => ({
      default: m.CommandPalette,
    })),
  { ssr: false }
);

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
import { useEditorGroups } from "@/hooks/use-editor-groups";
import { useIdeKeyboardShortcuts } from "@/hooks/use-ide-keyboard-shortcuts";
import { useIdeLayoutState } from "@/hooks/use-ide-layout-state";
import type { GitCommitItem } from "@/lib/github";

interface IdeLayoutProps {
  children: React.ReactNode;
  commits?: GitCommitItem[];
}

export function IdeLayout({ children, commits = [] }: IdeLayoutProps) {
  const pathname = usePathname();
  const [embed] = useQueryState("embed", parseAsBoolean.withDefault(false));
  const isEmbed = embed;
  const contentRef = useRef<HTMLDivElement>(null);

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

  const layoutState = useIdeLayoutState(activeHref);

  const {
    commandOpen,
    copyContent,
    focusSourceControl,
    mainRef,
    mobileSidebarView,
    openMobileExplorer,
    openMobileSourceControl,
    pageTitle,
    setCommandOpen,
    setMobileSidebarView,
    setSidebarView,
    setTerminalOpen,
    setViewMode,
    sidebarOpen,
    sidebarView,
    terminalOpen,
    toggleFullscreen,
    toggleSidebar,
    toggleTerminal,
    viewMode,
    isFullscreen,
  } = layoutState;

  useIdeKeyboardShortcuts({
    contentRef,
    onToggleSidebar: toggleSidebar,
    onToggleTerminal: toggleTerminal,
  });

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
            onFocusSourceControl={focusSourceControl}
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
