"use client";

import { useEffect } from "react";
import type { EditorGroup } from "@/components/ide/shared/split-editor-types";
import { navItems } from "@/consts/nav-items";
import { matchNavItem } from "@/lib/ide/breadcrumb";

interface UseTabSyncParams {
  activeGroupIndex: number;
  closingRef: React.MutableRefObject<boolean>;
  editorGroups: EditorGroup[];
  openedFromSidebarRef: React.MutableRefObject<string | null>;
  pathname: string;
  setEditorGroups: React.Dispatch<React.SetStateAction<EditorGroup[]>>;
}

export function useTabSync({
  pathname,
  editorGroups,
  activeGroupIndex,
  setEditorGroups,
  closingRef,
  openedFromSidebarRef,
}: UseTabSyncParams) {
  useEffect(() => {
    if (closingRef.current) {
      setTimeout(() => {
        closingRef.current = false;
      }, 0);
      return;
    }
    const navItem = matchNavItem(pathname, navItems);
    if (!navItem) {
      openedFromSidebarRef.current = null;
      return;
    }
    const group = editorGroups[activeGroupIndex];
    if (!group) {
      return;
    }
    if (group.tabs.length === 0) {
      setEditorGroups((prev) => {
        const next = [...prev];
        next[activeGroupIndex] = { tabs: [navItem.href], activeIndex: 0 };
        return next;
      });
      return;
    }
    if (group.tabs.includes(navItem.href)) {
      const idx = group.tabs.indexOf(navItem.href);
      if (idx !== group.activeIndex) {
        setEditorGroups((prev) => {
          const next = [...prev];
          next[activeGroupIndex] = { ...group, activeIndex: idx };
          return next;
        });
      }
      openedFromSidebarRef.current = null;
      return;
    }
    if (
      openedFromSidebarRef.current &&
      openedFromSidebarRef.current !== navItem.href
    ) {
      return;
    }
    openedFromSidebarRef.current = null;
    setEditorGroups((prev) => {
      const next = [...prev];
      const g = next[activeGroupIndex];
      const newTabs = [...g.tabs, navItem.href];
      next[activeGroupIndex] = {
        tabs: newTabs,
        activeIndex: newTabs.length - 1,
      };
      return next;
    });
  }, [pathname, editorGroups, activeGroupIndex, setEditorGroups]);
}
