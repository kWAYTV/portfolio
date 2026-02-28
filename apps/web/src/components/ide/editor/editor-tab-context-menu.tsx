"use client";

import { useTranslations } from "next-intl";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

interface EditorTabContextMenuProps {
  groupIndex?: number;
  href: string;
  index: number;
  onCloseAll: () => void;
  onCloseGroup?: () => void;
  onCloseOtherTabs: (href: string) => void;
  onCloseTab: (href: string) => void;
  onCloseTabsToRight: (href: string) => void;
  onSplitLeft?: (href: string) => void;
  onSplitRight?: (href: string) => void;
  orderedItemsLength: number;
  showSplitButtons?: boolean;
  totalGroups?: number;
}

export function EditorTabContextMenu({
  href,
  index,
  onCloseAll,
  onCloseOtherTabs,
  onCloseTab,
  onCloseTabsToRight,
  orderedItemsLength,
  groupIndex = 0,
  onCloseGroup,
  onSplitLeft,
  onSplitRight,
  showSplitButtons,
  totalGroups = 1,
}: EditorTabContextMenuProps) {
  const t = useTranslations("ide");

  return (
    <ContextMenuContent className="w-44 rounded-sm border border-border bg-popover p-0.5">
      <ContextMenuItem onClick={() => onCloseTab(href)}>
        {t("close")}
      </ContextMenuItem>
      {showSplitButtons && totalGroups !== undefined && (
        <>
          <ContextMenuSeparator />
          {((groupIndex ?? 0) < totalGroups - 1 || totalGroups === 1) && (
            <ContextMenuItem onClick={() => onSplitRight?.(href)}>
              {totalGroups === 1 ? t("openToRight") : t("splitRight")}
            </ContextMenuItem>
          )}
          {((groupIndex ?? 0) > 0 || totalGroups === 1) && (
            <ContextMenuItem onClick={() => onSplitLeft?.(href)}>
              {totalGroups === 1 ? t("openToLeft") : t("splitLeft")}
            </ContextMenuItem>
          )}
        </>
      )}
      {orderedItemsLength > 1 && (
        <>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => onCloseOtherTabs(href)}>
            {t("closeOthers")}
          </ContextMenuItem>
          <ContextMenuItem
            disabled={index >= orderedItemsLength - 1}
            onClick={() => onCloseTabsToRight(href)}
          >
            {t("closeToRight")}
          </ContextMenuItem>
        </>
      )}
      <ContextMenuSeparator />
      {onCloseGroup && totalGroups !== undefined && totalGroups > 1 && (
        <ContextMenuItem onClick={onCloseGroup}>
          {t("closeGroup")}
        </ContextMenuItem>
      )}
      <ContextMenuItem onClick={onCloseAll}>{t("closeAll")}</ContextMenuItem>
    </ContextMenuContent>
  );
}
