"use client";

import { cn } from "@portfolio/ui";
import { GitBranch, PanelLeft, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";

interface MobileActivityBarProps {
  onOpenExplorer: () => void;
  onOpenSourceControl: () => void;
  onToggleTerminal: () => void;
  terminalOpen: boolean;
}

export const MobileActivityBar = memo(function MobileActivityBar({
  onOpenExplorer,
  onOpenSourceControl,
  onToggleTerminal,
  terminalOpen,
}: MobileActivityBarProps) {
  const t = useTranslations("ide");

  return (
    <div className="flex h-12 shrink-0 items-center justify-around gap-1 border-border border-t bg-sidebar px-2 md:hidden">
      <button
        aria-label={t("explorer")}
        className="flex min-h-[44px] min-w-[44px] flex-1 touch-manipulation items-center justify-center gap-2 rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        onClick={onOpenExplorer}
        type="button"
      >
        <PanelLeft className="size-5 shrink-0" />
        <span className="text-xs">{t("explorer")}</span>
      </button>
      <button
        aria-label={t("sourceControl")}
        className="flex min-h-[44px] min-w-[44px] flex-1 touch-manipulation items-center justify-center gap-2 rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        onClick={onOpenSourceControl}
        type="button"
      >
        <GitBranch className="size-5 shrink-0" />
        <span className="text-xs">{t("sourceControl")}</span>
      </button>
      <button
        aria-label={t("terminal")}
        className={cn(
          "flex min-h-[44px] min-w-[44px] flex-1 touch-manipulation items-center justify-center gap-2 rounded-md transition-colors hover:bg-sidebar-accent/50",
          terminalOpen
            ? "bg-sidebar-accent/60 text-sidebar-foreground"
            : "text-muted-foreground hover:text-sidebar-foreground"
        )}
        onClick={onToggleTerminal}
        type="button"
      >
        <Terminal className="size-5 shrink-0" />
        <span className="text-xs">{t("terminal")}</span>
      </button>
    </div>
  );
});
