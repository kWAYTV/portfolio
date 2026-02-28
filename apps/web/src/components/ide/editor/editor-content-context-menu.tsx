"use client";

import { Code, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ViewMode } from "@/components/ide/shared/view-mode";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface EditorContentContextMenuProps {
  children: React.ReactNode;
  onViewModeChange: (mode: ViewMode) => void;
  viewMode: ViewMode;
}

export function EditorContentContextMenu({
  children,
  onViewModeChange,
  viewMode,
}: EditorContentContextMenuProps) {
  const t = useTranslations("ide");

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-44 rounded-sm border border-border bg-popover p-0.5">
        <ContextMenuItem
          className={viewMode === "preview" ? "bg-muted/50" : undefined}
          onClick={() => onViewModeChange("preview")}
        >
          <Eye className="size-4" />
          {t("preview")}
        </ContextMenuItem>
        <ContextMenuItem
          className={viewMode === "code" ? "bg-muted/50" : undefined}
          onClick={() => onViewModeChange("code")}
        >
          <Code className="size-4" />
          {t("source")}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
