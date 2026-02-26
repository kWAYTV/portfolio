"use client";

import { usePathname } from "@i18n/routing";
import { TooltipProvider } from "@portfolio/ui";
import { ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";
import { navItems } from "@/consts/nav-items";
import { ActivityBar } from "./activity-bar";
import { EditorTabs } from "./editor-tabs";
import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import { StatusBar } from "./status-bar";
import { TitleBar } from "./title-bar";

function Breadcrumbs({ pathname }: { pathname: string }) {
  const parts = ["portfolio", "src"];

  const navItem = navItems.find((item) => {
    if (item.href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(item.href);
  });

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
    <div className="flex shrink-0 items-center gap-1 border-[var(--ide-border)] border-b bg-[var(--ide-editor)] px-4 py-1 text-[11px] text-[var(--ide-breadcrumb-fg)]">
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-dvh flex-col overflow-hidden bg-[var(--ide-editor)]">
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
            {/* Tab bar - desktop only */}
            <div className="hidden md:block">
              <EditorTabs pathname={pathname} />
            </div>

            <Breadcrumbs pathname={pathname} />

            {/* Editor content */}
            <main className="flex-1 overflow-y-auto">{children}</main>
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
