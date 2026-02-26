"use client";

import { usePathname, useRouter } from "@i18n/routing";
import { cn, TooltipProvider } from "@portfolio/ui";
import { useCallback, useEffect, useRef, useState } from "react";

import { navItems } from "@/consts/nav-items";
import { ActivityBar } from "./activity-bar";
import { Breadcrumbs } from "./breadcrumbs";
import { CommandPalette } from "./command-palette";
import { EditorContentContextMenu } from "./editor-content-context-menu";
import { EditorPane } from "./editor-pane";
import { EditorTabs } from "./editor-tabs";
import { MobileMenu } from "./mobile-menu";
import { Sidebar } from "./sidebar";
import { SplitEditorView } from "./split-editor-view";
import { StatusBar } from "./status-bar";
import { TerminalPanel } from "./terminal-panel";
import { TitleBar } from "./title-bar";
import type { EditorGroup } from "./split-editor-types";
import { type ViewMode, ViewModeProvider } from "./view-mode";

function matchNavItem(pathname: string) {
  return navItems.find((item) => {
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.href);
  });
}

function getBreadcrumbPath(pathname: string): string {
  const parts = ["portfolio", "src"];
  const navItem = matchNavItem(pathname);
  if (navItem) {
    if (pathname.startsWith("/blog") && pathname !== "/blog") {
      parts.push("blog");
      parts.push(pathname.replace("/blog/", "") + ".mdx");
    } else if (navItem.href === "/blog") {
      parts.push("blog", "index.mdx");
    } else {
      parts.push(navItem.fileName);
    }
  }
  return parts.join(" / ");
}

interface IdeLayoutProps {
  children: React.ReactNode;
}

export function IdeLayout({ children }: IdeLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");

  useEffect(() => {
    setPageTitle(typeof document !== "undefined" ? document.title : "");
  }, []);

  const initialTabs = navItems.map((item) => item.href);
  const [editorGroups, setEditorGroups] = useState<EditorGroup[]>(() => [
    { tabs: initialTabs, activeIndex: 0 },
  ]);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [splitRatio, setSplitRatio] = useState(0.5);
  const closingRef = useRef(false);
  const openedFromSidebarRef = useRef<string | null>(null);
  const activeGroupIndexRef = useRef(0);
  activeGroupIndexRef.current = activeGroupIndex;

  const activeGroup = editorGroups[activeGroupIndex];
  const activeHref = activeGroup?.tabs[activeGroup?.activeIndex] ?? activeGroup?.tabs[0];

  useEffect(() => {
    if (closingRef.current) {
      closingRef.current = false;
      return;
    }
    const navItem = matchNavItem(pathname);
    if (!navItem) {
      openedFromSidebarRef.current = null;
      return;
    }
    const group = editorGroups[activeGroupIndex];
    if (!group) return;
    if (group.tabs.length === 0) {
      setEditorGroups((prev) => {
        const next = [...prev];
        next[activeGroupIndex] = { tabs: [navItem.href], activeIndex: 0 };
        return next;
      });
      return;
    }
    if (group.tabs.includes(navItem.href)) {
      const idx = group.tabs.indexOf(navItem.href);
      setEditorGroups((prev) => {
        const next = [...prev];
        next[activeGroupIndex] = { ...group, activeIndex: idx };
        return next;
      });
      openedFromSidebarRef.current = null;
      return;
    }
    if (
      openedFromSidebarRef.current &&
      openedFromSidebarRef.current !== navItem.href
    ) {
      return;
    }
    openedFromSidebarRef.current = null;
    setEditorGroups((prev) => {
      const next = [...prev];
      const g = next[activeGroupIndex];
      const newTabs = [...g.tabs, navItem.href];
      next[activeGroupIndex] = {
        tabs: newTabs,
        activeIndex: newTabs.length - 1,
      };
      return next;
    });
  }, [pathname, editorGroups, activeGroupIndex]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const openTab = useCallback((href: string) => {
    openedFromSidebarRef.current = href;
    const idx = activeGroupIndexRef.current;
    setEditorGroups((prev) => {
      const next = [...prev];
      const g = next[idx];
      if (!g) return prev;
      if (g.tabs.includes(href)) {
        const i = g.tabs.indexOf(href);
        next[idx] = { ...g, activeIndex: i };
        return next;
      }
      const newTabs = [...g.tabs, href];
      next[idx] = { tabs: newTabs, activeIndex: newTabs.length - 1 };
      return next;
    });
  }, []);

  const closeTab = useCallback(
    (groupIndex: number, href: string) => {
      const group = editorGroups[groupIndex];
      if (!group) return;
      const idx = group.tabs.indexOf(href);
      if (idx === -1) return;

      const nextTabs = group.tabs.filter((h) => h !== href);
      const isActive =
        href === "/" ? pathname === "/" : pathname.startsWith(href);

      setEditorGroups((prev) => {
        const next = [...prev];
        if (nextTabs.length === 0) {
          next.splice(groupIndex, 1);
          if (next.length === 0) {
            return [{ tabs: [], activeIndex: 0 }];
          }
          if (activeGroupIndex >= next.length) {
            setActiveGroupIndex(next.length - 1);
          }
          return next;
        }
        const newActiveIndex = Math.min(idx, nextTabs.length - 1);
        next[groupIndex] = { tabs: nextTabs, activeIndex: newActiveIndex };
        return next;
      });

      if (isActive) {
        closingRef.current = true;
        if (nextTabs.length > 0) {
          const target = nextTabs[Math.min(idx, nextTabs.length - 1)];
          router.push(target);
        } else if (editorGroups.length > 1) {
          const otherGroup = editorGroups[groupIndex === 0 ? 1 : 0];
          const target = otherGroup?.tabs[otherGroup.activeIndex] ?? otherGroup?.tabs[0];
          if (target) router.push(target);
        }
      }
    },
    [pathname, editorGroups, activeGroupIndex, router]
  );

  const reorderTabs = useCallback((groupIndex: number, newOrder: string[]) => {
    setEditorGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      if (!g) return prev;
      const newActiveIndex = newOrder.indexOf(g.tabs[g.activeIndex]);
      next[groupIndex] = {
        tabs: newOrder,
        activeIndex: newActiveIndex >= 0 ? newActiveIndex : 0,
      };
      return next;
    });
  }, []);

  const closeAllTabs = useCallback((groupIndex?: number) => {
    closingRef.current = true;
    if (groupIndex !== undefined) {
      setEditorGroups((prev) => {
        const next = prev.filter((_, i) => i !== groupIndex);
        return next.length > 0 ? next : [{ tabs: [], activeIndex: 0 }];
      });
      setActiveGroupIndex((prev) =>
        prev >= groupIndex && prev > 0 ? prev - 1 : prev
      );
    } else {
      setEditorGroups([{ tabs: [], activeIndex: 0 }]);
    }
  }, []);

  const closeGroup = useCallback((groupIndex: number) => {
    const group = editorGroups[groupIndex];
    if (!group || editorGroups.length <= 1) return;
    const targetGroupIndex = groupIndex === 0 ? 1 : 0;
    const targetGroup = editorGroups[targetGroupIndex];
    if (!targetGroup) return;
    const mergedTabs = [...new Set([...targetGroup.tabs, ...group.tabs])];
    setEditorGroups((prev) => {
      const next = prev.filter((_, i) => i !== groupIndex);
      next[0] = {
        tabs: mergedTabs,
        activeIndex: Math.min(targetGroup.activeIndex, mergedTabs.length - 1),
      };
      return next;
    });
    setActiveGroupIndex(0);
    const activeHref = targetGroup.tabs[targetGroup.activeIndex] ?? targetGroup.tabs[0];
    if (activeHref) {
      closingRef.current = true;
      router.push(activeHref);
    }
  }, [editorGroups, router]);

  const closeOtherTabs = useCallback(
    (groupIndex: number, keepHref: string) => {
      setEditorGroups((prev) => {
        const next = [...prev];
        next[groupIndex] = { tabs: [keepHref], activeIndex: 0 };
        return next;
      });
      const isActive =
        keepHref === "/" ? pathname === "/" : pathname.startsWith(keepHref);
      if (!isActive) {
        closingRef.current = true;
        router.push(keepHref);
      }
    },
    [pathname, router]
  );

  const closeTabsToRight = useCallback((groupIndex: number, href: string) => {
    setEditorGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      if (!g) return prev;
      const idx = g.tabs.indexOf(href);
      if (idx === -1) return prev;
      const newTabs = g.tabs.slice(0, idx + 1);
      next[groupIndex] = { tabs: newTabs, activeIndex: Math.min(g.activeIndex, newTabs.length - 1) };
      return next;
    });
  }, []);

  const splitRight = useCallback((groupIndex: number, href: string) => {
    setEditorGroups((prev) => {
      const next = prev.map((g) => ({ ...g }));
      const rightIdx = groupIndex + 1;
      if (rightIdx < next.length) {
        const right = next[rightIdx];
        if (right && !right.tabs.includes(href)) {
          next[rightIdx] = {
            tabs: [...right.tabs, href],
            activeIndex: right.tabs.length,
          };
        }
        return next;
      }
      const newGroup: EditorGroup = { tabs: [href], activeIndex: 0 };
      next.splice(groupIndex + 1, 0, newGroup);
      return next;
    });
    setActiveGroupIndex(groupIndex + 1);
    router.push(href);
  }, [router]);

  const splitLeft = useCallback((groupIndex: number, href: string) => {
    setEditorGroups((prev) => {
      const next = prev.map((g) => ({ ...g }));
      if (groupIndex > 0) {
        const left = next[groupIndex - 1];
        if (left && !left.tabs.includes(href)) {
          next[groupIndex - 1] = {
            tabs: [...left.tabs, href],
            activeIndex: left.tabs.length,
          };
        }
        return next;
      }
      const newGroup: EditorGroup = { tabs: [href], activeIndex: 0 };
      next.splice(0, 0, newGroup);
      return next;
    });
    setActiveGroupIndex(Math.max(0, groupIndex - 1));
    router.push(href);
  }, [router]);

  const moveTabToGroup = useCallback(
    (targetGroupIndex: number, href: string, sourceGroupIndex: number) => {
      if (targetGroupIndex === sourceGroupIndex) return;
      setEditorGroups((prev) => {
        const next = prev.map((g) => ({ ...g }));
        const src = next[sourceGroupIndex];
        const dst = next[targetGroupIndex];
        if (!src || !dst) return prev;
        const tabIdx = src.tabs.indexOf(href);
        if (tabIdx === -1) return prev;
        const newSrcTabs = src.tabs.filter((h) => h !== href);
        const newDstTabs = [...dst.tabs, href];
        if (newSrcTabs.length === 0) {
          next.splice(sourceGroupIndex, 1);
          const newTargetIdx = targetGroupIndex > sourceGroupIndex ? targetGroupIndex - 1 : targetGroupIndex;
          next[newTargetIdx] = {
            tabs: newDstTabs,
            activeIndex: newDstTabs.length - 1,
          };
        } else {
          next[sourceGroupIndex] = {
            tabs: newSrcTabs,
            activeIndex: Math.min(src.activeIndex, newSrcTabs.length - 1),
          };
          next[targetGroupIndex] = {
            tabs: newDstTabs,
            activeIndex: newDstTabs.length - 1,
          };
        }
        return next;
      });
      const willRemoveSource = editorGroups[sourceGroupIndex]?.tabs.length === 1;
      const newTargetIdx = willRemoveSource && targetGroupIndex > sourceGroupIndex
        ? targetGroupIndex - 1
        : targetGroupIndex;
      setActiveGroupIndex(newTargetIdx);
      router.push(href);
    },
    [router, editorGroups]
  );

  const focusGroup = useCallback(
    (groupIndex: number, href?: string) => {
      setActiveGroupIndex(groupIndex);
      const group = editorGroups[groupIndex];
      if (!group?.tabs.length) return;
      const targetHref = href ?? group.tabs[group.activeIndex] ?? group.tabs[0];
      const tabIdx = group.tabs.indexOf(targetHref);
      if (tabIdx >= 0) {
        setEditorGroups((prev) => {
          const next = [...prev];
          const g = next[groupIndex];
          if (g) next[groupIndex] = { ...g, activeIndex: tabIdx };
          return next;
        });
      }
      router.push(targetHref);
    },
    [editorGroups, router]
  );

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
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

  const contentRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const copyContent = useCallback(() => {
    const path = activeHref ?? pathname;
    const title = pageTitle || (typeof document !== "undefined" ? document.title : "");
    const breadcrumb = getBreadcrumbPath(path);
    const mainText = mainRef.current?.innerText ?? "";
    const formatted = [title, breadcrumb, mainText].filter(Boolean).join("\n\n");
    void navigator.clipboard.writeText(formatted);
  }, [pathname, pageTitle, activeHref]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        const el = contentRef.current;
        if (!el) return;
        const range = document.createRange();
        range.selectNodeContents(el);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "j") {
        e.preventDefault();
        setTerminalOpen((p) => !p);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  const hasOpenTabs = editorGroups.some((g) => g.tabs.length > 0);
  const hasSplit = editorGroups.length > 1;

  return (
    <ViewModeProvider value={{ viewMode, setViewMode }}>
      <TooltipProvider delayDuration={300}>
        <CommandPalette
          onOpenChange={setCommandOpen}
          onToggleSidebar={toggleSidebar}
          onToggleTerminal={() => setTerminalOpen((p) => !p)}
          open={commandOpen}
          sidebarOpen={sidebarOpen}
          terminalOpen={terminalOpen}
        />
        <div className="flex h-dvh flex-col overflow-hidden bg-background">
          <TitleBar
            leftSlot={
              <MobileMenu
                onToggleTerminal={() => setTerminalOpen((p) => !p)}
                pathname={pathname}
                terminalOpen={terminalOpen}
              />
            }
            maximized={isFullscreen}
            onClose={closeAllTabs}
            onMaximize={toggleFullscreen}
            onMinimize={isFullscreen ? toggleFullscreen : toggleSidebar}
          />

          <div className="flex min-h-0 flex-1">
            <div className="hidden md:block">
              <ActivityBar
                onOpenCommand={() => setCommandOpen(true)}
                onToggleSidebar={toggleSidebar}
                onToggleTerminal={() => setTerminalOpen((p) => !p)}
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

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
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
                    reorderTabs={reorderTabs}
                    setSplitRatio={setSplitRatio}
                    splitLeft={splitLeft}
                    splitRatio={splitRatio}
                    splitRight={splitRight}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
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
                    onDropFromOtherGroup={(href, src) => moveTabToGroup(0, href, src)}
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
                      ref={contentRef}
                      className="flex min-w-0 flex-1 flex-col overflow-hidden outline-none"
                      tabIndex={-1}
                    >
                      <span className="sr-only" aria-hidden>
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
                          ref={mainRef}
                          className="min-h-0 flex-1 overflow-y-auto"
                          data-ide-main
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
                    onCloseGroup={editorGroups.length > 1 ? (i) => closeGroup(i) : undefined}
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
              onToggleTerminal={() => setTerminalOpen((p) => !p)}
              pathname={activeHref ?? pathname}
              terminalOpen={terminalOpen}
            />
          </div>

        </div>
      </TooltipProvider>
    </ViewModeProvider>
  );
}
