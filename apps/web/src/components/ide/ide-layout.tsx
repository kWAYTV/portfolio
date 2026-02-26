"use client";

import { usePathname } from "@i18n/routing";
import { cn, TooltipProvider } from "@portfolio/ui";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { navItems } from "@/consts/nav-items";
import { useEditorGroups } from "@/hooks/use-editor-groups";
import { useIdeKeyboardShortcuts } from "@/hooks/use-ide-keyboard-shortcuts";
import { getBreadcrumbPath } from "@/lib/ide/breadcrumb";
import { ActivityBar } from "./activity-bar";
import { Breadcrumbs } from "./breadcrumbs";
import { CommandPalette } from "./command-palette";
import { EditorContentContextMenu } from "./editor-content-context-menu";
import { EditorTabs } from "./editor-tabs";
import { MobileMenu } from "./mobile-menu";
import { Sidebar } from "./sidebar";
import { SplitEditorView } from "./split-editor-view";
import { StatusBar } from "./status-bar";
import { TerminalPanel } from "./terminal-panel";
import { TitleBar } from "./title-bar";
import { type ViewMode, ViewModeProvider } from "./view-mode";

interface IdeLayoutProps {
  children: React.ReactNode;
}

export function IdeLayout({ children }: IdeLayoutProps) {
  const pathname = usePathname();
  const [embed] = useQueryState("embed", parseAsBoolean.withDefault(false));
  const isEmbed = embed;
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
  } = useEditorGroups();

  const contentRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const toggleTerminal = useCallback(() => {
    setTerminalOpen((prev) => !prev);
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
    return (
      <main
        className="min-h-screen w-full overflow-y-auto"
        data-ide-main
        data-preview
      >
        {children}
      </main>
    );
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
                onToggleTerminal={toggleTerminal}
                pathname={pathname}
                sidebarOpen={sidebarOpen}
                terminalOpen={terminalOpen}
              />
            </div>

            {sidebarOpen && (
              <div className="hidden md:block">
                <Sidebar onOpenTab={openTab} pathname={pathname} />
              </div>
            )}

            <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden">
              {hasOpenTabs ? (
                hasSplit ? (
                  <SplitEditorView
                    activeGroupIndex={activeGroupIndex}
                    closeAllTabs={closeAllTabs}
                    closeGroup={closeGroup}
                    closeOtherTabs={closeOtherTabs}
                    closeTab={closeTab}
                    closeTabsToRight={closeTabsToRight}
                    copyContent={copyContent}
                    editorGroups={editorGroups}
                    focusGroup={focusGroup}
                    mainRef={mainRef}
                    moveTabToGroup={moveTabToGroup}
                    onViewModeChange={setViewMode}
                    reorderTabs={reorderTabs}
                    setSplitRatio={setSplitRatio}
                    splitLeft={splitLeft}
                    splitRatio={splitRatio}
                    splitRight={splitRight}
                    viewMode={viewMode}
                  >
                    {children}
                  </SplitEditorView>
                ) : (
                  <>
                    <div className="hidden md:block">
                      <EditorTabs
                        groupIndex={0}
                        onCloseAll={() => closeAllTabs()}
                        onCloseOtherTabs={(href) => closeOtherTabs(0, href)}
                        onCloseTab={(href) => closeTab(0, href)}
                        onCloseTabsToRight={(href) => closeTabsToRight(0, href)}
                        onDropFromOtherGroup={(href, src) =>
                          moveTabToGroup(0, href, src)
                        }
                        onReorder={(order) => reorderTabs(0, order)}
                        onSplitLeft={(href) => splitLeft(0, href)}
                        onSplitRight={(href) => splitRight(0, href)}
                        onTabClick={(href) => focusGroup(0, href)}
                        openTabs={editorGroups[0]?.tabs ?? []}
                        pathname={pathname}
                        showSplitButtons={true}
                        totalGroups={1}
                      />
                    </div>
                    <div
                      className="flex w-full min-w-0 flex-1 flex-col overflow-hidden outline-none"
                      ref={contentRef}
                      tabIndex={-1}
                    >
                      <span aria-hidden className="sr-only">
                        {pageTitle}
                      </span>
                      <Breadcrumbs
                        onCopy={copyContent}
                        onViewModeChange={setViewMode}
                        pathname={pathname}
                        viewMode={viewMode}
                      />
                      <EditorContentContextMenu
                        onCopy={copyContent}
                        onViewModeChange={setViewMode}
                        viewMode={viewMode}
                      >
                        <main
                          className={cn(
                            "min-h-0 w-full min-w-0 flex-1 overflow-y-auto",
                            viewMode === "preview" && "min-h-full"
                          )}
                          data-ide-main
                          ref={mainRef}
                          {...(viewMode === "preview" && {
                            "data-preview": "",
                          })}
                        >
                          {children}
                        </main>
                      </EditorContentContextMenu>
                    </div>
                  </>
                )
              ) : (
                <div className="hidden flex-1 md:flex">
                  <EditorTabs
                    onCloseAll={() => closeAllTabs()}
                    onCloseGroup={
                      editorGroups.length > 1 ? (i) => closeGroup(i) : undefined
                    }
                    onCloseOtherTabs={(href) => closeOtherTabs(0, href)}
                    onCloseTab={(href) => closeTab(0, href)}
                    onCloseTabsToRight={(href) => closeTabsToRight(0, href)}
                    onReorder={(order) => reorderTabs(0, order)}
                    openTabs={[]}
                    pathname={pathname}
                  />
                </div>
              )}
              <TerminalPanel
                isOpen={terminalOpen}
                onClose={() => setTerminalOpen(false)}
              />
            </div>
          </div>

          <div className="hidden md:block">
            <StatusBar
              onToggleTerminal={toggleTerminal}
              pathname={pathname}
              terminalOpen={terminalOpen}
            />
          </div>
        </div>
      </TooltipProvider>
    </ViewModeProvider>
  );
}
