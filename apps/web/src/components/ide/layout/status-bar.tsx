"use client";

import { GitBranch, Play, Terminal } from "lucide-react";
import { LocaleSwitcher } from "@/components/internationalization/locale-switcher";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { cn } from "@/lib/utils";

interface StatusBarProps {
  onToggleTerminal: () => void;
  terminalOpen: boolean;
}

export function StatusBar({ terminalOpen, onToggleTerminal }: StatusBarProps) {
  return (
    <div className="flex h-11 shrink-0 select-none items-center justify-between gap-2 overflow-hidden border-border border-t bg-secondary px-2 py-1 text-[11px] text-muted-foreground shadow-(--shadow-elevation-sm) sm:h-6 sm:px-3 sm:py-0">
      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        <a
          aria-label="Open repository"
          className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
          href="https://github.com"
          rel="noopener noreferrer"
          target="_blank"
          title="Open repository"
        >
          <GitBranch className="size-3.5 shrink-0" />
          <span className="hidden sm:inline">main</span>
        </a>
      </div>
      <div className="flex min-w-0 shrink-0 items-center gap-1 overflow-x-auto sm:gap-3 [&_button:hover]:text-foreground! [&_button]:min-h-[44px] [&_button]:min-w-[44px] [&_button]:touch-manipulation [&_button]:text-[11px]! [&_button]:text-muted-foreground! sm:[&_button]:min-h-[36px] sm:[&_button]:min-w-[36px]">
        <button
          aria-label="Open preview"
          className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
          onClick={() => {
            window
              .open(
                window.location.href,
                "_blank",
                "noopener,noreferrer,width=1200,height=800"
              )
              ?.focus();
          }}
          title="Open preview"
          type="button"
        >
          <Play className="size-3.5" />
          <span className="hidden sm:inline">Preview</span>
        </button>
        <button
          aria-label="Terminal"
          className={cn(
            "flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground",
            terminalOpen && "text-foreground"
          )}
          onClick={onToggleTerminal}
          type="button"
        >
          <Terminal className="size-3.5" />
          <span className="hidden sm:inline">Terminal</span>
        </button>
        <div className="hidden sm:flex sm:items-center sm:gap-3">
          <LocaleSwitcher />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
