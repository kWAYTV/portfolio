"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Breadcrumbs } from "./breadcrumbs";
import { EditorContentContextMenu } from "./editor-content-context-menu";
import { EditorTabs } from "./editor-tabs";
import type { EditorGroup } from "./split-editor-types";
import type { ViewMode } from "./view-mode";

interface EditorPaneProps {
  children?: React.ReactNode;
  group: EditorGroup;
  groupIndex: number;
  isActiveGroup: boolean;
  mainRef?: React.RefObject<HTMLElement | null>;
  totalGroups: number;
  onCloseAll: (groupIndex: number) => void;
  onCloseGroup?: (groupIndex: number) => void;
  onCloseOtherTabs: (groupIndex: number, href: string) => void;
  onCloseTab: (groupIndex: number, href: string) => void;
  onCloseTabsToRight: (groupIndex: number, href: string) => void;
  onCopy: () => void;
  onDropFromOtherGroup?: (href: string, sourceGroupIndex: number) => void;
  onFocusGroup: (groupIndex: number, href?: string) => void;
  onReorder: (groupIndex: number, newOrder: string[]) => void;
  onSplitLeft: (groupIndex: number, href: string) => void;
  onSplitRight: (groupIndex: number, href: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function EditorPane({
  children,
  group,
  groupIndex,
  isActiveGroup,
  onCloseAll,
  onCloseGroup,
  onCloseOtherTabs,
  onCloseTab,
  onCloseTabsToRight,
  onCopy,
  onDropFromOtherGroup,
  onFocusGroup,
  onReorder,
  onSplitLeft,
  onSplitRight,
  mainRef: mainRefProp,
  totalGroups,
  viewMode,
  onViewModeChange,
}: EditorPaneProps) {
  const locale = useLocale();
  const localMainRef = useRef<HTMLElement>(null);
  const mainRef = mainRefProp ?? localMainRef;

  const activeHref = group.tabs[group.activeIndex] ?? group.tabs[0];
  const [iframeSrc, setIframeSrc] = useState("");
  useEffect(() => {
    setIframeSrc(
      `${window.location.origin}/${locale}${activeHref === "/" ? "" : activeHref}`
    );
  }, [locale, activeHref]);

  const handleTabClick = (href?: string) => {
    onFocusGroup(groupIndex, href);
  };

  if (group.tabs.length === 0) {
    return null;
  }

  return (
    <div
      className="flex min-w-0 flex-1 flex-col overflow-hidden"
      onClick={() => handleTabClick()}
      onFocus={() => handleTabClick()}
      role="group"
      tabIndex={0}
    >
      <EditorTabs
        activeGroupIndex={groupIndex}
        groupIndex={groupIndex}
        onCloseAll={() => onCloseAll(groupIndex)}
        onCloseGroup={onCloseGroup ? () => onCloseGroup?.(groupIndex) : undefined}
        onCloseOtherTabs={(href) => onCloseOtherTabs(groupIndex, href)}
        onCloseTab={(href) => onCloseTab(groupIndex, href)}
        onCloseTabsToRight={(href) => onCloseTabsToRight(groupIndex, href)}
        onDropFromOtherGroup={onDropFromOtherGroup}
        onReorder={(order) => onReorder(groupIndex, order)}
        onSplitLeft={(href) => onSplitLeft(groupIndex, href)}
        onSplitRight={(href) => onSplitRight(groupIndex, href)}
        onTabClick={(href) => handleTabClick(href)}
        openTabs={group.tabs}
        pathname={activeHref}
        showSplitButtons={true}
        totalGroups={totalGroups}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden outline-none">
        {isActiveGroup && children ? (
          <>
            <Breadcrumbs
              onCopy={onCopy}
              onViewModeChange={onViewModeChange}
              pathname={activeHref}
              viewMode={viewMode}
            />
            <EditorContentContextMenu
              onCopy={onCopy}
              onViewModeChange={onViewModeChange}
              viewMode={viewMode}
            >
              <main
                ref={mainRef}
                className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto"
                data-ide-main
              >
                {children}
              </main>
            </EditorContentContextMenu>
          </>
        ) : (
          <iframe
            className="min-h-0 flex-1 w-full border-0"
            src={iframeSrc}
            title={activeHref}
          />
        )}
      </div>
    </div>
  );
}
