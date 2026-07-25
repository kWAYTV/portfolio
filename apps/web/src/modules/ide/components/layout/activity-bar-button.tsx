"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityBarButtonProps {
  active?: boolean;
  ariaLabel: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function ActivityBarButton({
  active,
  icon: Icon,
  onClick,
  ariaLabel,
}: ActivityBarButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        "ide-accent-bar relative flex size-10 cursor-pointer items-center justify-center text-sidebar-foreground/55 transition-[color,box-shadow] duration-[var(--dur-micro)] ease-[var(--ease-out)] hover:text-sidebar-foreground",
        active && "text-[var(--color-accent-signal)]"
      )}
      data-active={active ? "true" : "false"}
      onClick={onClick}
      type="button"
    >
      <Icon className="size-5" />
    </button>
  );
}
