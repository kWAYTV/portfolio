"use client";

import type { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
