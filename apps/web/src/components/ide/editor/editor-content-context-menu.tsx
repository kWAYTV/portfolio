"use client";

import { Code } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ViewMode } from "@/components/ide/shared/view-mode";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { CopyIcon } from "@/components/ui/copy";
import { EyeIcon } from "@/components/ui/eye";

interface EditorContentContextMenuProps {
  children: React.ReactNode;
  onCopy?: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  viewMode: ViewMode;
}

export function EditorContentContextMenu({
  children,
  onCopy,
  onViewModeChange,
  viewMode,
}: EditorContentContextMenuProps) {
  const t = useTranslations("ide");

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-36 rounded-sm border border-border bg-popover p-0.5">
        {onCopy && (
          <>
            <ContextMenuItem onClick={onCopy}>
              <CopyIcon className="mr-1.5" size={14} />
              {t("copyContent")}
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem
          className={viewMode === "preview" ? "bg-muted/50" : undefined}
          onClick={() => onViewModeChange("preview")}
        >
          <EyeIcon size={14} />
          {t("preview")}
        </ContextMenuItem>
        <ContextMenuItem
          className={viewMode === "code" ? "bg-muted/50" : undefined}
          onClick={() => onViewModeChange("code")}
        >
          <Code className="size-3.5" />
          {t("source")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
