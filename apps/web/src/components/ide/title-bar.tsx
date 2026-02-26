"use client";

import { Minus, Square, X } from "lucide-react";

export function TitleBar() {
  return (
    <div className="flex h-9 shrink-0 items-center border-border border-b bg-secondary px-4">
      <div className="group/dots hidden items-center gap-[7px] py-2 pr-2 md:flex">
        <span className="dot-close relative flex size-3 items-center justify-center rounded-full bg-[#ff5f57] transition-transform hover:scale-110">
          <X className="size-[8px] stroke-[2.5] text-[#4d0000] opacity-0 transition-opacity group-hover/dots:opacity-100" />
        </span>
        <span className="dot-minimize relative flex size-3 items-center justify-center rounded-full bg-[#febc2e] transition-transform hover:scale-110">
          <Minus className="size-[8px] stroke-[2.5] text-[#995700] opacity-0 transition-opacity group-hover/dots:opacity-100" />
        </span>
        <span className="dot-maximize relative flex size-3 items-center justify-center rounded-full bg-[#28c840] transition-transform hover:scale-110">
          <Square className="size-[6px] stroke-[2.5] text-[#006500] opacity-0 transition-opacity group-hover/dots:opacity-100" />
        </span>
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
