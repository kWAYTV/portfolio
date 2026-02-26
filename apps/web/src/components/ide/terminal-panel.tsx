"use client";

import { cn, Tooltip, TooltipContent, TooltipTrigger } from "@portfolio/ui";
import { PanelBottomClose, Terminal } from "lucide-react";
import { MockTerminal } from "./mock-terminal";

interface TerminalPanelProps {
  onClose: () => void;
  isOpen: boolean;
}

export function TerminalPanel({ onClose, isOpen }: TerminalPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="flex min-h-[120px] max-h-[40vh] shrink-0 flex-col border-border border-t bg-background">
      <div className="flex h-9 shrink-0 items-center justify-between border-border border-b bg-muted/60 px-2">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 text-muted-foreground" />
          <span className="text-[11px] font-medium text-foreground">Terminal</span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={onClose}
              type="button"
            >
              <PanelBottomClose className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Close panel</TooltipContent>
        </Tooltip>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <MockTerminal />
      </div>
    </div>
  );
}
