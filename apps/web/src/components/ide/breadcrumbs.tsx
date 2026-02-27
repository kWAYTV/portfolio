"use client";

import { cn } from "@portfolio/ui";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { navItems } from "@/consts/nav-items";
import { getBreadcrumbParts } from "@/lib/ide/breadcrumb";
import type { ViewMode } from "@/components/ide/view-mode";

interface BreadcrumbsProps {
  onViewModeChange: (mode: ViewMode) => void;
  pathname: string;
  viewMode: ViewMode;
}

export const Breadcrumbs = memo(function Breadcrumbs({
  pathname,
  viewMode,
  onViewModeChange,
}: BreadcrumbsProps) {
  const t = useTranslations("ide");
  const parts = getBreadcrumbParts(pathname, navItems);

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 overflow-hidden border-border border-b bg-background px-2 py-1 text-[11px] text-muted-foreground sm:px-3">
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
        aria-label="View mode"
        className="flex items-center rounded-sm"
        role="group"
      >
        <button
          className={cn(
            "cursor-pointer rounded px-1.5 py-0.5 text-[10px] transition-colors",
            viewMode === "preview"
              ? "bg-muted/80 text-foreground"
              : "hover:text-foreground"
          )}
          onClick={() => onViewModeChange("preview")}
          title={t("preview")}
          type="button"
        >
          {t("preview")}
        </button>
        <button
          className={cn(
            "cursor-pointer rounded px-1.5 py-0.5 text-[10px] transition-colors",
            viewMode === "code"
              ? "bg-muted/80 text-foreground"
              : "hover:text-foreground"
          )}
          onClick={() => onViewModeChange("code")}
          title={t("source")}
          type="button"
        >
          {t("source")}
        </button>
      </div>
    </div>
  );
});
