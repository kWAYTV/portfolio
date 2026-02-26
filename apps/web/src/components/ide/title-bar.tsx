"use client";

import { cn } from "@portfolio/ui";
import { Minus, Square, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface TitleBarProps {
  leftSlot?: React.ReactNode;
  maximized: boolean;
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
}

export function TitleBar({
  leftSlot,
  maximized,
  onClose,
  onMinimize,
  onMaximize,
}: TitleBarProps) {
  const t = useTranslations("common");
  return (
    <div className="flex h-9 shrink-0 select-none items-center border-border border-b bg-secondary px-2 sm:px-4">
      <div className="flex shrink-0 items-center gap-2 pr-2">
        {leftSlot}
        <div className="group/dots hidden items-center gap-[7px] md:flex">
        <button
          className="dot-close relative flex size-3 cursor-pointer items-center justify-center rounded-full bg-[#ff5f57] transition-transform hover:scale-110"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          type="button"
        >
          <X className="size-[8px] stroke-[2.5] text-[#4d0000] opacity-0 transition-opacity group-hover/dots:opacity-100" />
        </button>
        <button
          className="dot-minimize relative flex size-3 cursor-pointer items-center justify-center rounded-full bg-[#febc2e] transition-transform hover:scale-110"
          onClick={onMinimize}
          type="button"
        >
          <Minus className="size-[8px] stroke-[2.5] text-[#995700] opacity-0 transition-opacity group-hover/dots:opacity-100" />
        </button>
        <button
          className={cn(
            "dot-maximize relative flex size-3 cursor-pointer items-center justify-center rounded-full bg-[#28c840] transition-transform hover:scale-110",
            maximized &&
              "ring-1 ring-[#28c840]/50 ring-offset-1 ring-offset-secondary"
          )}
          onClick={onMaximize}
          type="button"
        >
          <Square className="size-[6px] stroke-[2.5] text-[#006500] opacity-0 transition-opacity group-hover/dots:opacity-100" />
        </button>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-center">
        <span className="truncate font-medium text-muted-foreground text-xs tracking-wide">
          {t("siteTitle")}
        </span>
      </div>
    </div>
  );
}
