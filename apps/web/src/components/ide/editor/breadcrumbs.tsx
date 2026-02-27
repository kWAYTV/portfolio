"use client";

import { ChevronRight } from "lucide-react";
import { navItems } from "@/components/ide/config";
import { cn } from "@/lib/utils";
import { useIdeStore } from "@/stores/ide-store";

function getBreadcrumbParts(pathname: string): string[] {
  if (pathname === "/") {
    return ["portfolio", "src", "page.tsx"];
  }
  const item = navItems.find((n) => pathname.startsWith(n.href));
  if (item) {
    return ["portfolio", "src", item.fileName];
  }
  return ["portfolio"];
}

interface BreadcrumbsProps {
  pathname: string;
}

export function Breadcrumbs({ pathname }: BreadcrumbsProps) {
  const viewMode = useIdeStore((s) => s.viewMode);
  const setViewMode = useIdeStore((s) => s.setViewMode);
  const parts = getBreadcrumbParts(pathname);

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 overflow-hidden border-border border-b bg-background px-2 py-1 text-[11px] text-muted-foreground sm:px-3">
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
        {parts.map((part, i) => {
          const key = parts.slice(0, i + 1).join("/");
          return (
            <span className="flex items-center gap-1" key={key}>
              {i > 0 && (
                <ChevronRight
                  aria-hidden
                  className="size-3 shrink-0 text-muted-foreground/50"
                />
              )}
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
      <fieldset className="flex items-center rounded-sm border-0 p-0">
        <legend className="sr-only">View mode</legend>
        <button
          className={cn(
            "cursor-pointer rounded px-1.5 py-0.5 text-[10px] transition-colors",
            viewMode === "preview"
              ? "bg-muted/80 text-foreground"
              : "hover:text-foreground"
          )}
          onClick={() => setViewMode("preview")}
          title="Preview"
          type="button"
        >
          Preview
        </button>
        <button
          className={cn(
            "cursor-pointer rounded px-1.5 py-0.5 text-[10px] transition-colors",
            viewMode === "code"
              ? "bg-muted/80 text-foreground"
              : "hover:text-foreground"
          )}
          onClick={() => setViewMode("code")}
          title="Source"
          type="button"
        >
          Source
        </button>
      </fieldset>
    </div>
  );
}
