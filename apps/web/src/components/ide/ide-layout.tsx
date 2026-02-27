"use client";

import { useCallback, useMemo, useState } from "react";
import { ActivityBar } from "@/components/ide/layout/activity-bar";
import { IdeEditorArea } from "@/components/ide/layout/ide-editor-area";
import { MobileActivityBar } from "@/components/ide/layout/mobile-activity-bar";
import { MobileMenu } from "@/components/ide/layout/mobile-menu";
import { StatusBar } from "@/components/ide/layout/status-bar";
import { TitleBar } from "@/components/ide/layout/title-bar";
import type { SidebarView } from "@/components/ide/shared/ide-types";
import { ViewModeProvider } from "@/components/ide/shared/view-mode";
import { Sidebar } from "@/components/ide/sidebar/sidebar";
import { SourceControlView } from "@/components/ide/sidebar/source-control-view";
import { TerminalPanel } from "@/components/ide/terminal/terminal-panel";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useLocalePathname } from "@/modules/i18n/routing";

interface IdeLayoutProps {
  children: React.ReactNode;
}

export function IdeLayout({ children }: IdeLayoutProps) {
  const pathname = useLocalePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarView, setSidebarView] = useState<SidebarView>("explorer");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"code" | "preview">("preview");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [openTabs, setOpenTabs] = useState<string[]>(["/"]);
  const [mobileSidebarView, setMobileSidebarView] =
    useState<SidebarView | null>(null);

  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);
  const toggleTerminal = useCallback(() => setTerminalOpen((o) => !o), []);
  const toggleFullscreen = useCallback(() => setIsFullscreen((f) => !f), []);

  const openTab = useCallback((href: string) => {
    setOpenTabs((tabs) => (tabs.includes(href) ? tabs : [...tabs, href]));
  }, []);

  const closeTab = useCallback((href: string) => {
    setOpenTabs((tabs) => tabs.filter((t) => t !== href));
  }, []);

  const closeAllTabs = useCallback(() => setOpenTabs([]), []);

  const viewModeValue = useMemo(() => ({ viewMode, setViewMode }), [viewMode]);

  return (
    <ViewModeProvider value={viewModeValue}>
      <div className="flex h-dvh flex-col overflow-hidden bg-background">
        <TitleBar
          leftSlot={<MobileMenu pathname={pathname} />}
          maximized={isFullscreen}
          onClose={closeAllTabs}
          onMaximize={toggleFullscreen}
          onMinimize={isFullscreen ? toggleFullscreen : toggleSidebar}
        />

        <div className="flex min-h-0 flex-1">
          <div className="hidden md:block">
            <ActivityBar
              onToggleSidebar={toggleSidebar}
              onToggleSidebarView={setSidebarView}
              onToggleTerminal={toggleTerminal}
              sidebarOpen={sidebarOpen}
              sidebarView={sidebarView}
              terminalOpen={terminalOpen}
            />
          </div>

          {sidebarOpen && (
            <div className="hidden md:block">
              {sidebarView === "sourceControl" ? (
                <SourceControlView />
              ) : (
                <Sidebar onOpenTab={openTab} pathname={pathname} />
              )}
            </div>
          )}

          <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden">
            <IdeEditorArea
              closeAllTabs={closeAllTabs}
              closeTab={closeTab}
              onTabClick={(href: string) => openTab(href)}
              onViewModeChange={setViewMode}
              openTabs={openTabs}
              pathname={pathname}
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
          onOpenExplorer={() => setMobileSidebarView("explorer")}
          onOpenSourceControl={() => setMobileSidebarView("sourceControl")}
          onToggleTerminal={toggleTerminal}
          terminalOpen={terminalOpen}
        />

        <StatusBar
          onToggleTerminal={toggleTerminal}
          terminalOpen={terminalOpen}
        />

        <Sheet
          onOpenChange={(open) => !open && setMobileSidebarView(null)}
          open={mobileSidebarView !== null}
        >
          <SheetContent
            className="flex h-full w-full max-w-full flex-col gap-0 overflow-hidden p-0 md:hidden"
            side="left"
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {mobileSidebarView === "sourceControl" && (
                <SourceControlView
                  fullWidth
                  onClose={() => setMobileSidebarView(null)}
                />
              )}
              {mobileSidebarView === "explorer" && (
                <Sidebar
                  fullWidth
                  onClose={() => setMobileSidebarView(null)}
                  onOpenTab={openTab}
                  pathname={pathname}
                />
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </ViewModeProvider>
  );
}
