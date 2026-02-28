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
        "flex size-10 cursor-pointer items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary",
        active && "text-sidebar-primary"
      )}
      onClick={onClick}
      type="button"
    >
      <Icon className="size-5" />
    </button>
  );
}
