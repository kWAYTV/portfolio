"use client";

import { create } from "zustand";
import { navItems } from "@/components/ide/config";
import type { EditorGroup } from "@/components/ide/shared/split-editor-types";
import { matchNavItem } from "@/lib/ide/breadcrumb";

const initialTabs = navItems.map((item) => item.href);

type RouterPush = (path: string) => void;

interface EditorGroupsState {
  _closing: boolean;
  _openedFromSidebar: string | null;
  _router: RouterPush | null;
  editorGroups: EditorGroup[];
}

interface EditorGroupsActions {
  closeAllTabs: () => void;
  closeOtherTabs: (
    pathname: string,
    groupIndex: number,
    keepHref: string
  ) => void;
  closeTab: (pathname: string, groupIndex: number, href: string) => void;
  closeTabsToRight: (groupIndex: number, href: string) => void;
  openTab: (href: string) => void;
  reorderTabs: (groupIndex: number, newOrder: string[]) => void;
  setRouter: (router: RouterPush | null) => void;
  syncFromPathname: (pathname: string) => void;
}

export const useEditorGroupsStore = create<
  EditorGroupsState & EditorGroupsActions
>((set, get) => ({
  editorGroups: [{ tabs: initialTabs, activeIndex: 0 }],
  _closing: false,
  _openedFromSidebar: null,
  _router: null,

  setRouter: (router) => set({ _router: router }),

  syncFromPathname: (pathname) => {
    const { _closing, _openedFromSidebar, editorGroups } = get();
    if (_closing) {
      setTimeout(() => set({ _closing: false }), 0);
      return;
    }
    const navItem = matchNavItem(pathname, navItems);
    if (!navItem) {
      set({ _openedFromSidebar: null });
      return;
    }
    const group = editorGroups[0];
    if (!group) {
      return;
    }
    if (group.tabs.length === 0) {
      set((s) => {
        const next = [...s.editorGroups];
        next[0] = { tabs: [navItem.href], activeIndex: 0 };
        return { editorGroups: next, _openedFromSidebar: null };
      });
      return;
    }
    if (group.tabs.includes(navItem.href)) {
      const idx = group.tabs.indexOf(navItem.href);
      if (idx !== group.activeIndex) {
        set((s) => {
          const next = [...s.editorGroups];
          next[0] = { ...group, activeIndex: idx };
          return { editorGroups: next, _openedFromSidebar: null };
        });
      } else {
        set({ _openedFromSidebar: null });
      }
      return;
    }
    if (_openedFromSidebar && _openedFromSidebar !== navItem.href) {
      return;
    }
    set((s) => {
      const next = [...s.editorGroups];
      const g = next[0];
      const newTabs = [...g.tabs, navItem.href];
      next[0] = {
        tabs: newTabs,
        activeIndex: newTabs.length - 1,
      };
      return { editorGroups: next, _openedFromSidebar: null };
    });
  },

  openTab: (href) => {
    set({ _openedFromSidebar: href });
    set((s) => {
      const next = [...s.editorGroups];
      const g = next[0];
      if (!g) {
        return s;
      }
      if (g.tabs.includes(href)) {
        const i = g.tabs.indexOf(href);
        next[0] = { ...g, activeIndex: i };
      } else {
        const newTabs = [...g.tabs, href];
        next[0] = {
          tabs: newTabs,
          activeIndex: newTabs.length - 1,
        };
      }
      return { editorGroups: next };
    });
  },

  closeTab: (pathname, groupIndex, href) => {
    const { editorGroups, _router } = get();
    const group = editorGroups[groupIndex];
    if (!group) {
      return;
    }
    const idx = group.tabs.indexOf(href);
    if (idx === -1) {
      return;
    }
    const nextTabs = group.tabs.filter((h) => h !== href);
    const navItem = matchNavItem(pathname, navItems);
    const isActive = navItem?.href === href;

    set((s) => {
      const next = [...s.editorGroups];
      next[0] = {
        tabs: nextTabs,
        activeIndex: Math.min(idx, nextTabs.length - 1),
      };
      return { editorGroups: next, _closing: isActive };
    });

    if (isActive && _router && nextTabs.length > 0) {
      _router(nextTabs[Math.min(idx, nextTabs.length - 1)]);
    }
  },

  closeAllTabs: () => {
    set({
      editorGroups: [{ tabs: [], activeIndex: 0 }],
      _closing: true,
    });
  },

  closeOtherTabs: (pathname, groupIndex, keepHref) => {
    set((s) => {
      const next = [...s.editorGroups];
      next[groupIndex] = { tabs: [keepHref], activeIndex: 0 };
      return { editorGroups: next, _closing: true };
    });
    const navItem = matchNavItem(pathname, navItems);
    const isActive = navItem?.href === keepHref;
    const router = get()._router;
    if (!isActive && router) {
      router(keepHref);
    }
  },

  closeTabsToRight: (groupIndex, href) => {
    set((s) => {
      const next = [...s.editorGroups];
      const g = next[groupIndex];
      if (!g) {
        return s;
      }
      const idx = g.tabs.indexOf(href);
      if (idx === -1) {
        return s;
      }
      const newTabs = g.tabs.slice(0, idx + 1);
      next[groupIndex] = {
        tabs: newTabs,
        activeIndex: Math.min(g.activeIndex, newTabs.length - 1),
      };
      return { editorGroups: next };
    });
  },

  reorderTabs: (groupIndex, newOrder) => {
    set((s) => {
      const next = [...s.editorGroups];
      const g = next[groupIndex];
      if (!g) {
        return s;
      }
      const newActiveIndex = newOrder.indexOf(g.tabs[g.activeIndex]);
      next[groupIndex] = {
        tabs: newOrder,
        activeIndex: newActiveIndex >= 0 ? newActiveIndex : 0,
      };
      return { editorGroups: next };
    });
  },
}));

export const useActiveGroup = () =>
  useEditorGroupsStore((s) => s.editorGroups[0]);
export const useActiveHref = () =>
  useEditorGroupsStore((s) => {
    const g = s.editorGroups[0];
    return g?.tabs[g.activeIndex] ?? g?.tabs[0];
  });
