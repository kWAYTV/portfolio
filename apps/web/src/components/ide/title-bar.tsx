"use client";

import { cn, Tooltip, TooltipContent, TooltipTrigger } from "@portfolio/ui";
import { Minus, Square, X } from "lucide-react";

interface TitleBarProps {
  maximized: boolean;
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
}

export function TitleBar({
  maximized,
  onClose,
  onMinimize,
  onMaximize,
}: TitleBarProps) {
  return (
    <div className="flex h-9 shrink-0 select-none items-center border-border border-b bg-secondary px-4">
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
      <div className="flex-1 text-center">
        <span className="font-medium text-muted-foreground text-xs tracking-wide">
          Martin Vila — Portfolio
        </span>
      </div>
      <div className="hidden w-[55px] md:block" />
    </div>
  );
}
