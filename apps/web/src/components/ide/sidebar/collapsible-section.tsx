"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/ui/chevron-down";
import { ChevronRightIcon } from "@/components/ui/chevron-right";

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
  const Chevron = open ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className="flex flex-col">
      <button
        className="flex w-full items-center gap-1 py-[3px] pl-1 text-left font-medium text-[11px] text-muted-foreground uppercase tracking-wider transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <Chevron
          aria-hidden
          className="shrink-0 text-muted-foreground/70"
          size={14}
        />
        {title}
      </button>
      {open && children}
    </div>
  );
}
