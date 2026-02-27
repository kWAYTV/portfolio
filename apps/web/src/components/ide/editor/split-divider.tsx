"use client";

import { cn } from "@portfolio/ui";
import { GripVertical } from "lucide-react";
import { useTranslations } from "next-intl";

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
    <div
      className={cn(
        "-mx-2 z-10 flex w-2 shrink-0 items-center justify-center transition-colors duration-150",
        isActive
          ? "cursor-col-resize border-border border-x bg-muted/60"
          : "cursor-default border-transparent bg-transparent"
      )}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      role="separator"
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
