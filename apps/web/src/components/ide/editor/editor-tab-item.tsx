"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { FileIcon } from "@/components/ide/sidebar/file-icon";
import { cn } from "@/lib/utils";
import { LocaleLink } from "@/modules/i18n/routing";

interface EditorTabItemProps {
  active: boolean;
  fileName: string;
  fileType: string;
  href: string;
  onClose: () => void;
  onTabClick?: (href: string) => void;
}

export function EditorTabItem({
  active,
  fileName,
  fileType,
  href,
  onClose,
  onTabClick,
}: EditorTabItemProps) {
  const t = useTranslations("ide");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: href });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={cn(
        "group relative flex h-full min-w-0 max-w-[180px] select-none items-center border-border/60 border-r pr-1 text-[13px] transition-colors",
        active
          ? "bg-background text-foreground shadow-(--shadow-elevation-sm)"
          : "bg-muted/40 text-muted-foreground hover:bg-muted/70",
        isDragging && "opacity-50 shadow-md"
      )}
      ref={setNodeRef}
      style={style}
    >
      {active && (
        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-primary" />
      )}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 overflow-hidden px-3 py-1.5",
          isDragging && "cursor-grabbing"
        )}
      >
        <LocaleLink
          className="flex min-w-0 flex-1 items-center gap-2 truncate"
          draggable={false}
          href={href}
          onClick={() => onTabClick?.(href)}
        >
          <FileIcon
            className="size-4 shrink-0"
            name={fileName}
            type={fileType}
          />
          <span className="truncate">{fileName}</span>
        </LocaleLink>
      </div>
      <button
        aria-label={t("closeTab", { fileName })}
        className={cn(
          "flex size-5 shrink-0 touch-manipulation items-center justify-center rounded-sm transition-colors",
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

/** Static tab item for SSR/initial render to avoid dnd-kit hydration mismatch. */
export function EditorTabItemStatic({
  active,
  fileName,
  fileType,
  href,
  onClose,
  onTabClick,
}: EditorTabItemProps) {
  const t = useTranslations("ide");
  return (
    <div
      className={cn(
        "group relative flex h-full min-w-0 max-w-[180px] select-none items-center border-border/60 border-r pr-1 text-[13px] transition-colors",
        active
          ? "bg-background text-foreground shadow-(--shadow-elevation-sm)"
          : "bg-muted/40 text-muted-foreground hover:bg-muted/70"
      )}
    >
      {active && (
        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-primary" />
      )}
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden px-3 py-1.5">
        <LocaleLink
          className="flex min-w-0 flex-1 items-center gap-2 truncate"
          draggable={false}
          href={href}
          onClick={() => onTabClick?.(href)}
        >
          <FileIcon
            className="size-4 shrink-0"
            name={fileName}
            type={fileType}
          />
          <span className="truncate">{fileName}</span>
        </LocaleLink>
      </div>
      <button
        aria-label={t("closeTab", { fileName })}
        className={cn(
          "flex size-5 shrink-0 touch-manipulation items-center justify-center rounded-sm transition-colors",
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
