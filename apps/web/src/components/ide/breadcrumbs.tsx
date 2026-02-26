"use client";

import { cn } from "@portfolio/ui";
import { ChevronRight, Code, Copy, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { navItems } from "@/consts/nav-items";
import { getBreadcrumbParts } from "@/lib/ide/breadcrumb";
import type { ViewMode } from "./view-mode";

interface BreadcrumbsProps {
  onCopy?: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  pathname: string;
  viewMode: ViewMode;
}

export const Breadcrumbs = memo(function Breadcrumbs({
  pathname,
  viewMode,
  onViewModeChange,
  onCopy,
}: BreadcrumbsProps) {
  const t = useTranslations("ide");
  const parts = getBreadcrumbParts(pathname, navItems);

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
        aria-label="Editor actions"
        className="flex shrink-0 select-none items-center"
        role="group"
      >
        {onCopy && (
          <>
            <button
              className="flex cursor-pointer items-center justify-center rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              onClick={onCopy}
              title={t("copyContent")}
              type="button"
            >
              <Copy aria-hidden className="size-3.5" />
            </button>
            <span aria-hidden className="mx-0.5 h-3 w-px bg-border" />
          </>
        )}
        <div
          aria-label="View mode"
          className="flex items-center rounded-sm"
          role="group"
        >
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
            <Eye aria-hidden className="size-3.5" />
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
            <Code aria-hidden className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});
