"use client";

import { usePathname, useRouter } from "@i18n/routing";
import { TooltipProvider } from "@portfolio/ui";
import { ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { navItems } from "@/consts/nav-items";
import { ActivityBar } from "./activity-bar";
import { EditorTabs } from "./editor-tabs";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import { StatusBar } from "./status-bar";
import { TitleBar } from "./title-bar";

function matchNavItem(pathname: string) {
  return navItems.find((item) => {
    if (item.href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(item.href);
  });
}

function Breadcrumbs({ pathname }: { pathname: string }) {
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
    <div className="flex shrink-0 items-center gap-1 border-border border-b bg-background px-4 py-1 text-[11px] text-muted-foreground">
      {parts.map((part, i) => {
        const key = parts.slice(0, i + 1).join("/");
        return (
          <span className="flex items-center gap-1" key={key}>
            {i > 0 && <ChevronRight className="size-3 opacity-50" />}
            <span
              className={i === parts.length - 1 ? "text-foreground/80" : ""}
            >
              {part}
            </span>
          </span>
        );
      })}
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
  const [openTabs, setOpenTabs] = useState<string[]>(() =>
    navItems.map((item) => item.href)
  );
  const closingRef = useRef(false);

  useEffect(() => {
    if (closingRef.current) {
      closingRef.current = false;
      return;
    }
    const navItem = matchNavItem(pathname);
    if (navItem && !openTabs.includes(navItem.href)) {
      setOpenTabs((prev) => [...prev, navItem.href]);
    }
  }, [pathname, openTabs]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
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

  const hasOpenTabs = openTabs.length > 0;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-dvh flex-col overflow-hidden bg-background">
        <TitleBar />

        <div className="flex min-h-0 flex-1">
          {/* Activity bar - desktop only */}
          <div className="hidden md:block">
            <ActivityBar
              onToggleSidebar={toggleSidebar}
              pathname={pathname}
              sidebarOpen={sidebarOpen}
            />
          </div>

          {/* Sidebar - desktop only, toggleable */}
          {sidebarOpen && (
            <div className="hidden md:block">
              <Sidebar pathname={pathname} />
            </div>
          )}

          {/* Editor panel */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Tab bar + empty state - desktop only */}
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
                <Breadcrumbs pathname={pathname} />
                <main className="flex-1 overflow-y-auto">{children}</main>
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
          </div>
        </div>

        <StatusBar pathname={pathname} />

        {/* Mobile bottom nav */}
        <div className="md:hidden">
          <MobileNav pathname={pathname} />
        </div>
      </div>
    </TooltipProvider>
  );
}
