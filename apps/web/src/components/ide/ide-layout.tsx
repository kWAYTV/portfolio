"use client";

import { useEffect } from "react";
import { CommandPalette } from "@/components/ide/command-palette";
import { ActivityBar } from "@/components/ide/layout/activity-bar";
import { IdeEditorArea } from "@/components/ide/layout/ide-editor-area";
import { MobileActivityBar } from "@/components/ide/layout/mobile-activity-bar";
import { MobileMenu } from "@/components/ide/layout/mobile-menu";
import { StatusBar } from "@/components/ide/layout/status-bar";
import { TitleBar } from "@/components/ide/layout/title-bar";
import { Sidebar } from "@/components/ide/sidebar/sidebar";
import { SourceControlView } from "@/components/ide/sidebar/source-control-view";
import { TerminalPanel } from "@/components/ide/terminal/terminal-panel";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useLocalePathname, useLocaleRouter } from "@/modules/i18n/routing";
import { useEditorGroupsStore } from "@/stores/editor-groups-store";
import { useIdeStore } from "@/stores/ide-store";

interface IdeLayoutProps {
  children: React.ReactNode;
}

export function IdeLayout({ children }: IdeLayoutProps) {
  const pathname = useLocalePathname();
  const router = useLocaleRouter();
  const setRouter = useEditorGroupsStore((s) => s.setRouter);
  const syncFromPathname = useEditorGroupsStore((s) => s.syncFromPathname);

  const sidebarOpen = useIdeStore((s) => s.sidebarOpen);
  const isFullscreen = useIdeStore((s) => s.isFullscreen);
  const toggleSidebar = useIdeStore((s) => s.toggleSidebar);
  const toggleFullscreen = useIdeStore((s) => s.toggleFullscreen);
  const exitFullscreen = useIdeStore((s) => s.exitFullscreen);
  const setFullscreen = useIdeStore((s) => s.setFullscreen);
  const closeAllTabs = useEditorGroupsStore((s) => s.closeAllTabs);
  const mobileSidebarView = useIdeStore((s) => s.mobileSidebarView);
  const setMobileSidebarView = useIdeStore((s) => s.setMobileSidebarView);
  const setSidebarView = useIdeStore((s) => s.setSidebarView);

  useEffect(() => {
    setRouter((path: string) => router.push(path));
    return () => setRouter(null);
  }, [router, setRouter]);

  useEffect(() => {
    syncFromPathname(pathname);
  }, [pathname, syncFromPathname]);

  useEffect(() => {
    const handler = () => setFullscreen(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [setFullscreen]);

  const handleMinimize = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else if (sidebarOpen) {
      toggleSidebar();
    }
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <CommandPalette />
      <TitleBar
        leftSlot={<MobileMenu pathname={pathname} />}
        maximized={isFullscreen}
        onClose={closeAllTabs}
        onMaximize={toggleFullscreen}
        onMinimize={handleMinimize}
      />

      <div className="flex min-h-0 flex-1">
        <div className="hidden md:block">
          <ActivityBar />
        </div>

        {sidebarOpen && (
          <div className="hidden md:block">
            <IdeSidebarOrSourceControl pathname={pathname} />
          </div>
        )}

        <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden">
          <IdeEditorArea pageTitle="" pathname={pathname}>
            {children}
          </IdeEditorArea>
          <TerminalPanel />
        </div>
      </div>

      <MobileActivityBar />
      <StatusBar
        onFocusSourceControl={() => {
          setSidebarView("sourceControl");
          if (!sidebarOpen) {
            toggleSidebar();
          }
          setMobileSidebarView("sourceControl");
        }}
        pathname={pathname}
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
                pathname={pathname}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function IdeSidebarOrSourceControl({ pathname }: { pathname: string }) {
  const sidebarView = useIdeStore((s) => s.sidebarView);
  return sidebarView === "sourceControl" ? (
    <SourceControlView />
  ) : (
    <Sidebar pathname={pathname} />
  );
}
