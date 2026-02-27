"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CollapsibleSectionProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  title: string;
}

export function CollapsibleSection({
  children,
  defaultOpen = true,
  title,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const Chevron = open ? ChevronDown : ChevronRight;

  return (
    <div className="flex flex-col">
      <button
        className="flex w-full items-center gap-1 py-[3px] pl-1 text-left font-medium text-[11px] text-muted-foreground uppercase tracking-wider transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <Chevron className="size-3.5 shrink-0 opacity-70" />
        {title}
      </button>
      {open && children}
    </div>
  );
}
