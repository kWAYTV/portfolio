"use client";

import { ChevronRight, Code, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { navItems } from "@/components/ide/config";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { matchNavItem } from "@/lib/ide/breadcrumb";
import { cn } from "@/lib/utils";
import { useIdeStore } from "@/stores/ide-store";

function getBreadcrumbParts(pathname: string): string[] {
  const item = matchNavItem(pathname, navItems);
  if (item) {
    return ["portfolio", "src", item.fileName];
  }
  return ["portfolio"];
}

interface BreadcrumbsProps {
  pathname: string;
}

export function Breadcrumbs({ pathname }: BreadcrumbsProps) {
  const t = useTranslations("ide");
  const viewMode = useIdeStore((s) => s.viewMode);
  const setViewMode = useIdeStore((s) => s.setViewMode);
  const parts = getBreadcrumbParts(pathname);

  return (
    <div className="flex h-[35px] shrink-0 items-center justify-between gap-2 overflow-hidden border-border border-b bg-background px-2 text-[11px] text-muted-foreground sm:px-3">
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
      <fieldset className="flex items-center gap-1 border-0 p-0">
        <legend className="sr-only">{t("viewMode")}</legend>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "flex cursor-pointer items-center gap-1 px-1 py-0.5 text-[11px] transition-colors",
                viewMode === "preview"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setViewMode("preview")}
              type="button"
            >
              <Eye className="size-3.5 shrink-0" />
              {t("preview")}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("preview")}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "flex cursor-pointer items-center gap-1 px-1 py-0.5 text-[11px] transition-colors",
                viewMode === "code"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setViewMode("code")}
              type="button"
            >
              <Code className="size-3.5 shrink-0" />
              {t("source")}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("source")}</p>
          </TooltipContent>
        </Tooltip>
      </fieldset>
    </div>
  );
}
