"use client";

import { GripVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface SplitDividerProps {
  isActive: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function SplitDivider({
  isActive,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
}: SplitDividerProps) {
  const t = useTranslations("ide");

  return (
    // biome-ignore lint/a11y/useSemanticElements: hr cannot contain grip icon
    <div
      aria-label={t("dragToResize")}
      aria-orientation="vertical"
      aria-valuemax={1}
      aria-valuemin={0}
      aria-valuenow={0.5}
      className={cn(
        "z-10 -mx-2 flex w-2 shrink-0 cursor-default items-center justify-center border-transparent bg-transparent transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "cursor-col-resize border-border border-x bg-muted/60"
      )}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      role="separator"
      tabIndex={0}
      title={t("dragToResize")}
    >
      <GripVertical
        className={cn(
          "size-4 text-muted-foreground transition-opacity duration-150",
          isActive ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
