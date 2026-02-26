"use client";

import { usePathname, useRouter } from "@i18n/routing";
import { cn, TooltipProvider } from "@portfolio/ui";
import { ChevronRight, Code2, Eye } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { navItems } from "@/consts/nav-items";
import { ActivityBar } from "./activity-bar";
import { EditorTabs } from "./editor-tabs";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import { StatusBar } from "./status-bar";
import { TerminalPanel } from "./terminal-panel";
import { TitleBar } from "./title-bar";
import { type ViewMode, ViewModeProvider } from "./view-mode";

function matchNavItem(pathname: string) {
  return navItems.find((item) => {
    if (item.href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(item.href);
  });
}

function Breadcrumbs({
  pathname,
  viewMode,
  onViewModeChange,
}: {
  onViewModeChange: (mode: ViewMode) => void;
  pathname: string;
  viewMode: ViewMode;
}) {
  const parts = ["portfolio", "src"];

  const navItem = matchNavItem(pathname);

  if (navItem) {
    if (pathname.startsWith("/blog") && pathname !== "/blog") {
      parts.push("blog");
      const slug = pathname.replace("/blog/", "");
      parts.push(`${slug}.mdx`);
    } else if (navItem.href === "/blog") {
      parts.push("blog", "index.mdx");
    } else {
      parts.push(navItem.fileName);
    }
  }

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-border border-b bg-background px-3 py-1.5 text-[11px] text-muted-foreground sm:px-4 sm:py-1">
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
        {parts.map((part, i) => {
          const key = parts.slice(0, i + 1).join("/");
          return (
            <span className="flex items-center gap-1" key={key}>
              {i > 0 && <ChevronRight className="size-3 opacity-50" />}
              <span
                className={cn(
                  "truncate",
                  i === parts.length - 1 ? "text-foreground/80" : ""
                )}
              >
                {part}
              </span>
            </span>
          );
        })}
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <button
          className={cn(
            "rounded p-2 transition-colors touch-manipulation sm:p-1",
            viewMode === "preview"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onViewModeChange("preview")}
          title="Preview"
          type="button"
        >
          <Eye className="size-3.5" />
        </button>
        <button
          className={cn(
            "rounded p-2 transition-colors touch-manipulation sm:p-1",
            viewMode === "code"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onViewModeChange("code")}
          title="Source"
          type="button"
        >
          <Code2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

interface IdeLayoutProps {
  children: React.ReactNode;
}

export function IdeLayout({ children }: IdeLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [openTabs, setOpenTabs] = useState<string[]>(() =>
    navItems.map((item) => item.href)
  );
  const closingRef = useRef(false);
  const openedFromSidebarRef = useRef<string | null>(null);

  useEffect(() => {
    if (closingRef.current) {
      closingRef.current = false;
      return;
    }
    if (openTabs.length === 0) return;
    const navItem = matchNavItem(pathname);
    if (!navItem || openTabs.includes(navItem.href)) {
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
    setOpenTabs((prev) => [...prev, navItem.href]);
  }, [pathname, openTabs]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const openTab = useCallback((href: string) => {
    openedFromSidebarRef.current = href;
    setOpenTabs((prev) => (prev.includes(href) ? prev : [...prev, href]));
  }, []);

  const closeTab = useCallback(
    (href: string) => {
      const idx = openTabs.indexOf(href);
      if (idx === -1) {
        return;
      }

      const next = openTabs.filter((h) => h !== href);
      setOpenTabs(next);

      const isActive =
        href === "/" ? pathname === "/" : pathname.startsWith(href);

      if (isActive) {
        closingRef.current = true;
        if (next.length > 0) {
          const target = next[Math.min(idx, next.length - 1)];
          router.push(target);
        }
      }
    },
    [pathname, openTabs, router]
  );

  const reorderTabs = useCallback((newOrder: string[]) => {
    setOpenTabs(newOrder);
  }, []);

  const closeAllTabs = useCallback(() => {
    closingRef.current = true;
    setOpenTabs([]);
  }, []);

  const toggleMaximized = useCallback(() => {
    setMaximized((prev) => !prev);
  }, []);

  const hasOpenTabs = openTabs.length > 0;

  return (
    <ViewModeProvider value={{ viewMode, setViewMode }}>
      <TooltipProvider delayDuration={300}>
        <div className="flex h-dvh flex-col overflow-hidden bg-background">
          <TitleBar
            maximized={maximized}
            onClose={closeAllTabs}
            onMaximize={toggleMaximized}
            onMinimize={toggleSidebar}
          />

          <div className="flex min-h-0 flex-1">
            {!maximized && (
              <div className="hidden md:block">
                <ActivityBar
                  onToggleSidebar={toggleSidebar}
                  onToggleTerminal={() => setTerminalOpen((p) => !p)}
                  pathname={pathname}
                  sidebarOpen={sidebarOpen}
                  terminalOpen={terminalOpen}
                />
              </div>
            )}

            {!maximized && sidebarOpen && (
              <div className="hidden md:block">
                <Sidebar onOpenTab={openTab} pathname={pathname} />
              </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              {hasOpenTabs ? (
                <>
                  <div className="hidden md:block">
                    <EditorTabs
                      onCloseTab={closeTab}
                      onReorder={reorderTabs}
                      openTabs={openTabs}
                      pathname={pathname}
                    />
                  </div>
                  <Breadcrumbs
                    onViewModeChange={setViewMode}
                    pathname={pathname}
                    viewMode={viewMode}
                  />
                  <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
                </>
              ) : (
                <div className="hidden flex-1 md:flex">
                  <EditorTabs
                    onCloseTab={closeTab}
                    onReorder={reorderTabs}
                    openTabs={openTabs}
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

          <StatusBar
            onToggleTerminal={() => setTerminalOpen((p) => !p)}
            pathname={pathname}
            terminalOpen={terminalOpen}
          />

          <div className="md:hidden">
            <MobileNav pathname={pathname} />
          </div>
        </div>
      </TooltipProvider>
    </ViewModeProvider>
  );
}
