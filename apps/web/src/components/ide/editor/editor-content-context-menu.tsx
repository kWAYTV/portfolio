"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@portfolio/ui";
import { Code, Copy, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ViewMode } from "@/components/ide/shared/view-mode";

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
      <ContextMenuContent className="ide-dropdown w-44 rounded-sm border border-border bg-popover p-0.5 shadow-lg">
        {onCopy && (
          <ContextMenuItem onClick={onCopy}>
            <Copy className="mr-2 size-3.5" />
            {t("copyContent")}
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem
          className={viewMode === "preview" ? "bg-muted/50" : undefined}
          onClick={() => onViewModeChange("preview")}
        >
          <Eye className="mr-2 size-3.5" />
          {t("preview")}
        </ContextMenuItem>
        <ContextMenuItem
          className={viewMode === "code" ? "bg-muted/50" : undefined}
          onClick={() => onViewModeChange("code")}
        >
          <Code className="mr-2 size-3.5" />
          {t("source")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
