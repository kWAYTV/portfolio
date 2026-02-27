"use client";

import type { EditorGroup } from "@/components/ide/shared/split-editor-types";
import type { EditorTabsProps } from "./editor-tabs";

type EditorStore = {
  closeAllTabs: (groupIndex?: number) => void;
  closeGroup: (groupIndex: number) => void;
  closeOtherTabs: (
    pathname: string,
    groupIndex: number,
    keepHref: string
  ) => void;
  closeTab: (pathname: string, groupIndex: number, href: string) => void;
  closeTabsToRight: (groupIndex: number, href: string) => void;
  focusGroup: (groupIndex: number, href?: string) => void;
  moveTabToGroup: (
    targetGroupIndex: number,
    href: string,
    sourceGroupIndex: number
  ) => void;
  reorderTabs: (groupIndex: number, newOrder: string[]) => void;
  splitLeft: (groupIndex: number, href: string) => void;
  splitRight: (groupIndex: number, href: string) => void;
};

export function getEditorTabsPropsFromStore(
  pathname: string,
  groupIndex: number,
  editor: EditorStore,
  editorGroups: EditorGroup[],
  options: {
    hasSplit: boolean;
    hasOpenTabs: boolean;
    activeGroupIndex?: number;
  }
): EditorTabsProps {
  const { hasSplit, hasOpenTabs, activeGroupIndex = 0 } = options;
  const activeGroup = editorGroups[activeGroupIndex] ?? editorGroups[0];
  const openTabs = hasSplit
    ? (activeGroup?.tabs ?? [])
    : (editorGroups[0]?.tabs ?? []);

  const base: EditorTabsProps = {
    pathname,
    openTabs,
    onCloseAll: editor.closeAllTabs,
    onCloseOtherTabs: (href) =>
      editor.closeOtherTabs(pathname, groupIndex, href),
    onCloseTab: (href) => editor.closeTab(pathname, groupIndex, href),
    onCloseTabsToRight: (href) => editor.closeTabsToRight(groupIndex, href),
    onReorder: (order) => editor.reorderTabs(groupIndex, order),
    groupIndex,
    activeGroupIndex,
  };

  if (hasOpenTabs && hasSplit) {
    return {
      ...base,
      showSplitButtons: false,
      totalGroups: editorGroups.length,
      onTabClick: (href) => editor.focusGroup(groupIndex, href),
    };
  }

  if (hasOpenTabs) {
    return {
      ...base,
      showSplitButtons: true,
      totalGroups: 1,
      onTabClick: (href) => editor.focusGroup(0, href),
      onDropFromOtherGroup: (href, src) => editor.moveTabToGroup(0, href, src),
      onSplitLeft: (href) => editor.splitLeft(0, href),
      onSplitRight: (href) => editor.splitRight(0, href),
    };
  }

  return {
    ...base,
    openTabs: [],
    onCloseGroup:
      editorGroups.length > 1 ? (i) => editor.closeGroup(i) : undefined,
  };
}

type EditorAreaCallbacks = {
  closeAllTabs: () => void;
  closeGroup: (groupIndex: number) => void;
  closeOtherTabs: (groupIndex: number, href: string) => void;
  closeTab: (groupIndex: number, href: string) => void;
  closeTabsToRight: (groupIndex: number, href: string) => void;
  focusGroup: (groupIndex: number, href?: string) => void;
  moveTabToGroup: (
    targetGroupIndex: number,
    href: string,
    sourceGroupIndex: number
  ) => void;
  reorderTabs: (groupIndex: number, order: string[]) => void;
  splitLeft: (groupIndex: number, href: string) => void;
  splitRight: (groupIndex: number, href: string) => void;
};

export function getEditorTabsPropsFromCallbacks(
  pathname: string,
  groupIndex: number,
  callbacks: EditorAreaCallbacks,
  editorGroups: EditorGroup[],
  options: {
    hasSplit: boolean;
    hasOpenTabs: boolean;
    activeGroupIndex?: number;
  }
): EditorTabsProps {
  const { hasSplit, hasOpenTabs, activeGroupIndex = 0 } = options;
  const activeGroup = editorGroups[activeGroupIndex] ?? editorGroups[0];
  const openTabs = hasSplit
    ? (activeGroup?.tabs ?? [])
    : (editorGroups[0]?.tabs ?? []);

  const base: EditorTabsProps = {
    pathname,
    openTabs,
    onCloseAll: callbacks.closeAllTabs,
    onCloseOtherTabs: (href) => callbacks.closeOtherTabs(groupIndex, href),
    onCloseTab: (href) => callbacks.closeTab(groupIndex, href),
    onCloseTabsToRight: (href) => callbacks.closeTabsToRight(groupIndex, href),
    onReorder: (order) => callbacks.reorderTabs(groupIndex, order),
    groupIndex,
    activeGroupIndex,
  };

  if (hasOpenTabs && hasSplit) {
    return {
      ...base,
      showSplitButtons: false,
      totalGroups: editorGroups.length,
      onTabClick: (href) => callbacks.focusGroup(groupIndex, href),
    };
  }

  if (hasOpenTabs) {
    return {
      ...base,
      showSplitButtons: true,
      totalGroups: 1,
      onTabClick: (href) => callbacks.focusGroup(0, href),
      onDropFromOtherGroup: (href, src) =>
        callbacks.moveTabToGroup(0, href, src),
      onSplitLeft: (href) => callbacks.splitLeft(0, href),
      onSplitRight: (href) => callbacks.splitRight(0, href),
    };
  }

  return {
    ...base,
    openTabs: [],
    onCloseGroup:
      editorGroups.length > 1 ? (i) => callbacks.closeGroup(i) : undefined,
  };
}
