"use client";

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@portfolio/ui";
import { useTranslations } from "next-intl";

interface EditorTabContextMenuProps {
  groupIndex: number;
  index: number;
  itemHref: string;
  onCloseAll: () => void;
  onCloseGroup?: (groupIndex: number) => void;
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
  groupIndex,
  index,
  itemHref,
  onCloseAll,
  onCloseGroup,
  onCloseOtherTabs,
  onCloseTab,
  onCloseTabsToRight,
  onSplitLeft,
  onSplitRight,
  orderedItemsLength,
  showSplitButtons,
  totalGroups = 1,
}: EditorTabContextMenuProps) {
  const t = useTranslations("ide");

  return (
    <ContextMenuContent className="ide-dropdown w-44 rounded-sm border border-border bg-popover p-0.5 shadow-lg">
      <ContextMenuItem onClick={() => onCloseTab(itemHref)}>
        {t("close")}
      </ContextMenuItem>
      {showSplitButtons && totalGroups !== undefined && (
        <>
          <ContextMenuSeparator />
          {((groupIndex ?? 0) < totalGroups - 1 || totalGroups === 1) && (
            <ContextMenuItem onClick={() => onSplitRight?.(itemHref)}>
              {totalGroups === 1 ? t("openToRight") : t("splitRight")}
            </ContextMenuItem>
          )}
          {((groupIndex ?? 0) > 0 || totalGroups === 1) && (
            <ContextMenuItem onClick={() => onSplitLeft?.(itemHref)}>
              {totalGroups === 1 ? t("openToLeft") : t("splitLeft")}
            </ContextMenuItem>
          )}
        </>
      )}
      {orderedItemsLength > 1 && (
        <>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => onCloseOtherTabs(itemHref)}>
            {t("closeOthers")}
          </ContextMenuItem>
          <ContextMenuItem
            disabled={index >= orderedItemsLength - 1}
            onClick={() => onCloseTabsToRight(itemHref)}
          >
            {t("closeToRight")}
          </ContextMenuItem>
        </>
      )}
      <ContextMenuSeparator />
      {onCloseGroup && totalGroups !== undefined && totalGroups > 1 && (
        <ContextMenuItem onClick={() => onCloseGroup(groupIndex)}>
          {t("closeGroup")}
        </ContextMenuItem>
      )}
      <ContextMenuItem onClick={onCloseAll}>
        {t("closeAll")}
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
