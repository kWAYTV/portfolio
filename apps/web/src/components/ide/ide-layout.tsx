"use client";

import { usePathname, useRouter } from "@i18n/routing";
import { cn, TooltipProvider } from "@portfolio/ui";
import { ChevronRight, Code, Copy, Eye } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { navItems } from "@/consts/nav-items";
import { ActivityBar } from "./activity-bar";
import { CommandPalette } from "./command-palette";
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

function getBreadcrumbPath(pathname: string): string {
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
  return parts.join(" / ");
}

function Breadcrumbs({
  pathname,
  viewMode,
  onViewModeChange,
  onCopy,
}: {
  onCopy?: () => void;
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
      <div className="flex shrink-0 items-center justify-between gap-2 overflow-hidden border-border border-b bg-background px-2 py-1.5 text-[11px] text-muted-foreground sm:px-4 sm:py-1">
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
      <div
        className="flex shrink-0 select-none items-center"
        role="group"
        aria-label="Editor actions"
      >
        {onCopy && (
          <>
            <button
              className="flex cursor-pointer items-center justify-center rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              onClick={onCopy}
              title="Copy content"
              type="button"
            >
              <Copy className="size-3.5" aria-hidden />
            </button>
            <span
              className="mx-0.5 h-3 w-px bg-border"
              aria-hidden
            />
          </>
        )}
        <div className="flex items-center rounded-sm" role="group" aria-label="View mode">
          <button
            className={cn(
              "flex cursor-pointer items-center justify-center rounded p-1.5 transition-colors",
              viewMode === "preview"
                ? "bg-muted/80 text-foreground"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            )}
            onClick={() => onViewModeChange("preview")}
            title="Preview"
            type="button"
          >
            <Eye className="size-3.5" aria-hidden />
          </button>
          <button
            className={cn(
              "flex cursor-pointer items-center justify-center rounded p-1.5 transition-colors",
              viewMode === "code"
                ? "bg-muted/80 text-foreground"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
            )}
            onClick={() => onViewModeChange("code")}
            title="Source"
            type="button"
          >
            <Code className="size-3.5" aria-hidden />
          </button>
        </div>
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
  const [commandOpen, setCommandOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");

  useEffect(() => {
    setPageTitle(typeof document !== "undefined" ? document.title : "");
  }, []);
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
    const navItem = matchNavItem(pathname);
    if (!navItem) {
      openedFromSidebarRef.current = null;
      return;
    }
    if (openTabs.length === 0) {
      setOpenTabs([navItem.href]);
      return;
    }
    if (openTabs.includes(navItem.href)) {
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
    const title = pageTitle || (typeof document !== "undefined" ? document.title : "");
    const breadcrumb = getBreadcrumbPath(pathname);
    const mainText = mainRef.current?.innerText ?? "";
    const formatted = [title, breadcrumb, mainText].filter(Boolean).join("\n\n");
    void navigator.clipboard.writeText(formatted);
  }, [pathname, pageTitle]);

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

  const hasOpenTabs = openTabs.length > 0;

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
                <>
                  <div className="hidden md:block">
                    <EditorTabs
                      onCloseTab={closeTab}
                      onReorder={reorderTabs}
                      openTabs={openTabs}
                      pathname={pathname}
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
                    <main
                      ref={mainRef}
                      className="min-h-0 flex-1 overflow-y-auto"
                    >
                      {children}
                    </main>
                  </div>
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
            onOpenCommand={() => setCommandOpen(true)}
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
