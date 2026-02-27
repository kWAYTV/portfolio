"use client";

import { cn, Tooltip, TooltipContent, TooltipTrigger } from "@portfolio/ui";
import type { LucideIcon } from "lucide-react";

interface ActivityBarButtonProps {
  active?: boolean;
  icon: LucideIcon;
  onClick: () => void;
  tooltip: string;
}

export function ActivityBarButton({
  active,
  icon: Icon,
  onClick,
  tooltip,
}: ActivityBarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          aria-label={tooltip}
          className={cn(
            "flex size-10 cursor-pointer items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary",
            active && "text-sidebar-primary"
          )}
          onClick={onClick}
          type="button"
        >
          <Icon className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
  );
}
