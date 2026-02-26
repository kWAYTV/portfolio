"use client";

import { cn } from "@portfolio/ui";
import { ChevronRight, Code, Copy, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { navItems } from "@/consts/nav-items";
import type { ViewMode } from "./view-mode";

function matchNavItem(pathname: string) {
  return navItems.find((item) => {
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.href);
  });
}

interface BreadcrumbsProps {
  onCopy?: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  pathname: string;
  viewMode: ViewMode;
}

export function Breadcrumbs({
  pathname,
  viewMode,
  onViewModeChange,
  onCopy,
}: BreadcrumbsProps) {
  const t = useTranslations("ide");
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
              title={t("copyContent")}
              type="button"
            >
              <Copy className="size-3.5" aria-hidden />
            </button>
            <span className="mx-0.5 h-3 w-px bg-border" aria-hidden />
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
            title={t("preview")}
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
            title={t("source")}
            type="button"
          >
            <Code className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
