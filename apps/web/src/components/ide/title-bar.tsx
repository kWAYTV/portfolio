"use client";

import { Minus, Square, X } from "lucide-react";

export function TitleBar() {
  return (
    <div className="flex h-9 shrink-0 items-center border-[var(--ide-border)] border-b bg-[var(--ide-titlebar)] px-4">
      <div className="group/dots hidden items-center gap-[7px] py-2 pr-2 md:flex">
        <span className="relative flex size-3 items-center justify-center rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)] transition-[filter] hover:shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12),0_0_4px_rgba(255,95,87,0.4)] hover:brightness-110">
          <X className="size-[8px] stroke-[2.5] text-[#4d0000] opacity-0 transition-opacity group-hover/dots:opacity-100" />
        </span>
        <span className="relative flex size-3 items-center justify-center rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)] transition-[filter] hover:shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12),0_0_4px_rgba(254,188,46,0.4)] hover:brightness-110">
          <Minus className="size-[8px] stroke-[2.5] text-[#995700] opacity-0 transition-opacity group-hover/dots:opacity-100" />
        </span>
        <span className="relative flex size-3 items-center justify-center rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)] transition-[filter] hover:shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12),0_0_4px_rgba(40,200,64,0.4)] hover:brightness-110">
          <Square className="size-[6px] stroke-[2.5] text-[#006500] opacity-0 transition-opacity group-hover/dots:opacity-100" />
        </span>
      </div>
      <div className="flex-1 text-center">
        <span className="font-medium text-[var(--ide-titlebar-fg)] text-xs tracking-wide">
          Martin Vila — Portfolio
        </span>
      </div>
      <div className="hidden w-[55px] md:block" />
    </div>
  );
}
