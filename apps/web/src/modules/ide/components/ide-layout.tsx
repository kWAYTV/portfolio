"use client";

import { analytics } from "@repo/analytics";
import { useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useLocalePathname, useLocaleRouter } from "@/modules/i18n/routing";
import { CommandPalette } from "@/modules/ide/components/command-palette";
import { ActivityBar } from "@/modules/ide/components/layout/activity-bar";
import { IdeEditorArea } from "@/modules/ide/components/layout/ide-editor-area";
import { MobileActivityBar } from "@/modules/ide/components/layout/mobile-activity-bar";
import { MobileMenu } from "@/modules/ide/components/layout/mobile-menu";
import { StatusBar } from "@/modules/ide/components/layout/status-bar";
import { TitleBar } from "@/modules/ide/components/layout/title-bar";
import { Sidebar } from "@/modules/ide/components/sidebar/sidebar";
import { SourceControlView } from "@/modules/ide/components/sidebar/source-control-view";
import { TerminalPanel } from "@/modules/ide/components/terminal/terminal-panel";
import { useEditorGroupsStore } from "@/modules/ide/stores/editor-groups-store";
import { useIdeStore } from "@/modules/ide/stores/ide-store";

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
      analytics.sidebarToggle(false);
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
