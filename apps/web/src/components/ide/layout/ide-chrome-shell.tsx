"use client";

import { Sheet, SheetContent } from "@portfolio/ui";
import { ActivityBar } from "@/components/ide/layout/activity-bar";
import { MobileActivityBar } from "@/components/ide/layout/mobile-activity-bar";
import { MobileMenu } from "@/components/ide/layout/mobile-menu";
import { StatusBar } from "@/components/ide/layout/status-bar";
import { TitleBar } from "@/components/ide/layout/title-bar";
import { Sidebar } from "@/components/ide/sidebar/sidebar";
import { SourceControlView } from "@/components/ide/sidebar/source-control-view";
import type { GitCommitItem } from "@/lib/github";
import { useEditorGroupsStore } from "@/stores/editor-groups-store";
import { useIdeLayoutStore } from "@/stores/ide-layout-store";

interface IdeChromeShellBaseProps {
  commits: GitCommitItem[];
  fetchCommits: () => void;
  isRefreshing: boolean;
  onFocusSourceControl: () => void;
  pathname: string;
}

interface IdeChromeShellGridProps extends IdeChromeShellBaseProps {
  layout: "grid";
}

interface IdeChromeShellFlexProps extends IdeChromeShellBaseProps {
  contentSlot: React.ReactNode;
  layout: "flex";
}

type IdeChromeShellProps = IdeChromeShellGridProps | IdeChromeShellFlexProps;

export function IdeChromeShell(props: IdeChromeShellProps) {
  const {
    commits,
    fetchCommits,
    isRefreshing,
    onFocusSourceControl,
    pathname,
  } = props;
  const layout = useIdeLayoutStore();
  const editor = useEditorGroupsStore();

  const gridArea = (area: string) => ({ style: { gridArea: area } }) as const;

  const titleBar = (
    <TitleBar
      leftSlot={<MobileMenu pathname={pathname} />}
      maximized={layout.isFullscreen}
      onClose={() => editor.closeAllTabs()}
      onMaximize={layout.toggleFullscreen}
      onMinimize={
        layout.isFullscreen ? layout.toggleFullscreen : layout.toggleSidebar
      }
    />
  );

  const activityBar = (
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
  );

  const sidebar =
    layout.sidebarOpen &&
    (layout.sidebarView === "sourceControl" ? (
      <SourceControlView
        commits={commits}
        isRefreshing={isRefreshing}
        onRefresh={fetchCommits}
      />
    ) : (
      <Sidebar onOpenTab={editor.openTab} pathname={pathname} />
    ));

  const mobileActivityBar = (
    <MobileActivityBar
      onOpenExplorer={layout.openMobileExplorer}
      onOpenSourceControl={layout.openMobileSourceControl}
      onToggleTerminal={layout.toggleTerminal}
      terminalOpen={layout.terminalOpen}
    />
  );

  const statusBar = (
    <StatusBar
      onFocusSourceControl={onFocusSourceControl}
      onToggleTerminal={layout.toggleTerminal}
      pathname={pathname}
      terminalOpen={layout.terminalOpen}
    />
  );

  const sheet = (
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
              isRefreshing={isRefreshing}
              onClose={() => layout.setMobileSidebarView(null)}
              onRefresh={fetchCommits}
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
  );

  if (props.layout === "grid") {
    return (
      <>
        <div {...gridArea("title")}>{titleBar}</div>
        <div className="hidden md:block" {...gridArea("activity")}>
          {activityBar}
        </div>
        {layout.sidebarOpen && (
          <div className="hidden md:block" {...gridArea("sidebar")}>
            {sidebar}
          </div>
        )}
        <div {...gridArea("mobile")}>{mobileActivityBar}</div>
        <div {...gridArea("status")}>{statusBar}</div>
        {sheet}
      </>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      {titleBar}
      <div className="flex min-h-0 flex-1">
        <div className="hidden md:block">{activityBar}</div>
        {layout.sidebarOpen && <div className="hidden md:block">{sidebar}</div>}
        <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden">
          {props.contentSlot}
        </div>
      </div>
      {mobileActivityBar}
      {statusBar}
      {sheet}
    </div>
  );
}
