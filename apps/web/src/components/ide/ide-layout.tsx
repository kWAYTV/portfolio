"use client";

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
import { useLocalePathname } from "@/modules/i18n/routing";
import { useIdeStore } from "@/stores/ide-store";

interface IdeLayoutProps {
  children: React.ReactNode;
}

export function IdeLayout({ children }: IdeLayoutProps) {
  const pathname = useLocalePathname();

  const sidebarOpen = useIdeStore((s) => s.sidebarOpen);
  const isFullscreen = useIdeStore((s) => s.isFullscreen);
  const toggleSidebar = useIdeStore((s) => s.toggleSidebar);
  const toggleFullscreen = useIdeStore((s) => s.toggleFullscreen);
  const closeAllTabs = useIdeStore((s) => s.closeAllTabs);
  const mobileSidebarView = useIdeStore((s) => s.mobileSidebarView);
  const setMobileSidebarView = useIdeStore((s) => s.setMobileSidebarView);

  return (
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
          <ActivityBar />
        </div>

        {sidebarOpen && (
          <div className="hidden md:block">
            <IdeSidebarOrSourceControl pathname={pathname} />
          </div>
        )}

        <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden">
          <IdeEditorArea pathname={pathname}>{children}</IdeEditorArea>
          <TerminalPanel />
        </div>
      </div>

      <MobileActivityBar />
      <StatusBar />

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
