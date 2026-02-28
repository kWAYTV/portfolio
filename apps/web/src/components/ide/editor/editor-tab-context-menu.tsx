"use client";

import { useTranslations } from "next-intl";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

interface EditorTabContextMenuProps {
  href: string;
  index: number;
  onCloseAll: () => void;
  onCloseOtherTabs: (href: string) => void;
  onCloseTab: (href: string) => void;
  onCloseTabsToRight: (href: string) => void;
  orderedItemsLength: number;
}

export function EditorTabContextMenu({
  href,
  index,
  onCloseAll,
  onCloseOtherTabs,
  onCloseTab,
  onCloseTabsToRight,
  orderedItemsLength,
}: EditorTabContextMenuProps) {
  const t = useTranslations("ide");

  return (
    <ContextMenuContent className="w-44 rounded-sm border border-border bg-popover p-0.5">
      <ContextMenuItem onClick={() => onCloseTab(href)}>
        {t("close")}
      </ContextMenuItem>
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
      <ContextMenuItem onClick={onCloseAll}>{t("closeAll")}</ContextMenuItem>
    </ContextMenuContent>
  );
}
