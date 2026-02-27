"use client";

import { navItems } from "../config";
import { EditorTabItem } from "./editor-tab-item";
import { EditorTabsEmpty } from "./editor-tabs-empty";

interface EditorTabsProps {
  onCloseAll: () => void;
  onCloseTab: (href: string) => void;
  onTabClick?: (href: string) => void;
  openTabs: string[];
  pathname: string;
}

export function EditorTabs({
  pathname,
  openTabs,
  onCloseTab,
  onCloseAll: _onCloseAll,
  onTabClick,
}: EditorTabsProps) {
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const orderedItems = openTabs.flatMap((href) => {
    const item = navItems.find((n) => n.href === href);
    return item ? [item] : [];
  });

  if (orderedItems.length === 0) {
    return <EditorTabsEmpty />;
  }

  return (
    <div className="relative flex h-[35px] shrink-0 cursor-default items-stretch overflow-x-auto border-border border-b bg-muted/80 shadow-(--shadow-elevation-sm)">
      {orderedItems.map((item) => (
        <EditorTabItem
          active={isActive(item.href)}
          fileName={item.fileName}
          fileType={item.fileType}
          href={item.href}
          key={item.href}
          onClose={() => onCloseTab(item.href)}
          onTabClick={onTabClick}
        />
      ))}
    </div>
  );
}
