"use client";

import { GitBranch, PanelLeft, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIdeStore } from "@/stores/ide-store";

export function MobileActivityBar() {
  const terminalOpen = useIdeStore((s) => s.terminalOpen);
  const toggleTerminal = useIdeStore((s) => s.toggleTerminal);
  const setMobileSidebarView = useIdeStore((s) => s.setMobileSidebarView);

  return (
    <div className="flex h-12 shrink-0 items-center justify-around gap-1 border-border border-t bg-sidebar px-2 md:hidden">
      <button
        aria-label="Explorer"
        className="flex min-h-[44px] min-w-[44px] flex-1 touch-manipulation items-center justify-center gap-2 rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        onClick={() => setMobileSidebarView("explorer")}
        type="button"
      >
        <PanelLeft className="size-5 shrink-0" />
        <span className="text-xs">Explorer</span>
      </button>
      <button
        aria-label="Source Control"
        className="flex min-h-[44px] min-w-[44px] flex-1 touch-manipulation items-center justify-center gap-2 rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        onClick={() => setMobileSidebarView("sourceControl")}
        type="button"
      >
        <GitBranch className="size-5 shrink-0" />
        <span className="text-xs">Source</span>
      </button>
      <button
        aria-label="Terminal"
        className={cn(
          "flex min-h-[44px] min-w-[44px] flex-1 touch-manipulation items-center justify-center gap-2 rounded-md transition-colors hover:bg-sidebar-accent/50",
          terminalOpen
            ? "bg-sidebar-accent/60 text-sidebar-foreground"
            : "text-muted-foreground hover:text-sidebar-foreground"
        )}
        onClick={toggleTerminal}
        type="button"
      >
        <Terminal className="size-5 shrink-0" />
        <span className="text-xs">Terminal</span>
      </button>
    </div>
  );
}
