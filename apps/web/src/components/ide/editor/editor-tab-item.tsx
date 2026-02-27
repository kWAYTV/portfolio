"use client";

import { Link } from "@i18n/routing";
import { cn } from "@portfolio/ui";
import { X } from "lucide-react";
import { FileIcon } from "@/components/ide/sidebar/file-icon";

interface EditorTabItemProps {
  active: boolean;
  dragOverIndex: number | null;
  fileName: string;
  fileType: string;
  groupIndex: number;
  href: string;
  index: number;
  isDragging: boolean;
  onClose: () => void;
  onDragEnd: () => void;
  onDragOver: (index: number) => void;
  onDragStart: () => void;
  onTabClick?: (href: string) => void;
}

export function EditorTabItem({
  active,
  dragOverIndex,
  fileName,
  fileType,
  groupIndex,
  href,
  index,
  isDragging,
  onClose,
  onDragEnd,
  onDragOver,
  onDragStart,
  onTabClick,
}: EditorTabItemProps) {
  const isDropTarget = dragOverIndex === index;

  return (
    <div
      className={cn(
        "group relative flex h-full min-w-0 max-w-[180px] select-none items-center border-border/60 border-r pr-1 text-[13px] transition-colors",
        active
          ? "bg-background text-foreground shadow-[var(--shadow-elevation-sm)]"
          : "bg-muted/40 text-muted-foreground hover:bg-muted/70",
        isDropTarget && "border-l-2 border-l-primary"
      )}
    >
      {active && (
        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-primary" />
      )}
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 overflow-hidden px-3 py-1.5",
          isDragging ? "cursor-grabbing" : "cursor-default"
        )}
        draggable
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          onDragOver(index);
        }}
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", href);
          e.dataTransfer.setData(
            "application/json",
            JSON.stringify({ href, index, groupIndex })
          );
          onDragStart();
        }}
      >
        <Link
          className="flex min-w-0 flex-1 items-center gap-2 truncate"
          draggable={false}
          href={href}
          onClick={() => onTabClick?.(href)}
        >
          <FileIcon className="size-4 shrink-0" type={fileType} />
          <span className="truncate">{fileName}</span>
        </Link>
      </div>
      <button
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-sm transition-colors touch-manipulation",
          "opacity-100 md:opacity-0 md:group-hover:opacity-100",
          active && "md:opacity-100",
          active
            ? "text-foreground hover:bg-foreground/5"
            : "text-muted-foreground hover:bg-foreground/5"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        type="button"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
