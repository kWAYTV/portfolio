"use client";

import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@portfolio/ui";
import { Minus, Moon, Settings, Square, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";

interface TitleBarProps {
  maximized: boolean;
  onClose: () => void;
  onOpenCommand: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
}

export function TitleBar({
  maximized,
  onClose,
  onMinimize,
  onOpenCommand,
  onMaximize,
}: TitleBarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex h-9 shrink-0 select-none items-center border-border border-b bg-secondary px-2 sm:px-4">
      <div className="group/dots hidden items-center gap-[7px] py-2 pr-2 md:flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="dot-close relative flex size-3 cursor-pointer items-center justify-center rounded-full bg-[#ff5f57] transition-transform hover:scale-110"
              onClick={onClose}
              type="button"
            >
              <X className="size-[8px] stroke-[2.5] text-[#4d0000] opacity-0 transition-opacity group-hover/dots:opacity-100" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Close all tabs</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="dot-minimize relative flex size-3 cursor-pointer items-center justify-center rounded-full bg-[#febc2e] transition-transform hover:scale-110"
              onClick={onMinimize}
              type="button"
            >
              <Minus className="size-[8px] stroke-[2.5] text-[#995700] opacity-0 transition-opacity group-hover/dots:opacity-100" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Toggle sidebar</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "dot-maximize relative flex size-3 cursor-pointer items-center justify-center rounded-full bg-[#28c840] transition-transform hover:scale-110",
                maximized &&
                  "ring-1 ring-[#28c840]/50 ring-offset-1 ring-offset-secondary"
              )}
              onClick={onMaximize}
              type="button"
            >
              <Square className="size-[6px] stroke-[2.5] text-[#006500] opacity-0 transition-opacity group-hover/dots:opacity-100" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {maximized ? "Restore" : "Maximize"}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-center gap-1 sm:gap-2">
        <span className="truncate font-medium text-muted-foreground text-xs tracking-wide">
          Martin Vila — Portfolio
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded px-1.5 py-0.5 text-[10px] text-muted-foreground/70 transition-colors hover:bg-muted/60 hover:text-muted-foreground"
              onClick={onOpenCommand}
              type="button"
            >
              ⌘K
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Open command palette</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex size-7 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              type="button"
            >
              <Settings className="size-4" />
              <span className="sr-only">Settings</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={() => setTheme(isDark ? "light" : "dark")}>
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              <span>{isDark ? "Light" : "Dark"} theme</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenCommand}>
              <span>Command palette</span>
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
