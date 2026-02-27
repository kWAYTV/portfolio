"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { create } from "zustand";
import type { SidebarView } from "@/components/ide/shared/ide-types";
import type { EditorGroup } from "@/components/ide/shared/split-editor-types";
import type { ViewMode } from "@/components/ide/shared/view-mode";
import { navItems } from "@/consts/nav-items";
import { matchNavItem } from "@/lib/ide/breadcrumb";

const initialTabs = navItems.map((item) => item.href);

interface IdeState {
  // Internal (for sync)
  _closing: boolean;
  _openedFromSidebar: string | null;
  _router: AppRouterInstance | null;
  activeGroupIndex: number;
  commandOpen: boolean;

  // Editor groups
  editorGroups: EditorGroup[];
  isFullscreen: boolean;
  mobileSidebarView: SidebarView | null;
  pageTitle: string;
  // Layout
  sidebarOpen: boolean;
  sidebarView: SidebarView;
  splitRatio: number;
  terminalOpen: boolean;
  viewMode: ViewMode;
}

type IdeActions = {
  setRouter: (router: AppRouterInstance | null) => void;
  setPageTitle: (title: string) => void;

  // Layout actions
  toggleSidebar: () => void;
  toggleTerminal: () => void;
  setTerminalOpen: (open: boolean) => void;
  setSidebarView: (view: SidebarView) => void;
  setCommandOpen: (open: boolean) => void;
  setMobileSidebarView: (view: SidebarView | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  toggleFullscreen: () => Promise<void>;
  openMobileExplorer: () => void;
  openMobileSourceControl: () => void;
  focusSourceControl: (isMobile: boolean) => void;

  // Editor actions
  syncFromPathname: (pathname: string) => void;
  openTab: (href: string) => void;
  closeTab: (pathname: string, groupIndex: number, href: string) => void;
  closeAllTabs: (groupIndex?: number) => void;
  closeGroup: (groupIndex: number) => void;
  closeOtherTabs: (
    pathname: string,
    groupIndex: number,
    keepHref: string
  ) => void;
  closeTabsToRight: (groupIndex: number, href: string) => void;
  reorderTabs: (groupIndex: number, newOrder: string[]) => void;
  splitRight: (groupIndex: number, href: string) => void;
  splitLeft: (groupIndex: number, href: string) => void;
  moveTabToGroup: (
    targetGroupIndex: number,
    href: string,
    sourceGroupIndex: number
  ) => void;
  focusGroup: (groupIndex: number, href?: string) => void;
  setSplitRatio: (ratio: number) => void;
};

export type IdeStore = IdeState & IdeActions;

export const useIdeStore = create<IdeStore>((set, get) => ({
  sidebarOpen: true,
  sidebarView: "explorer",
  mobileSidebarView: null,
  terminalOpen: false,
  commandOpen: false,
  isFullscreen: false,
  viewMode: "preview",
  pageTitle: "",
  editorGroups: [{ tabs: initialTabs, activeIndex: 0 }],
  activeGroupIndex: 0,
  splitRatio: 0.5,
  _closing: false,
  _openedFromSidebar: null,
  _router: null,

  setRouter: (router) => set({ _router: router }),
  setPageTitle: (title) => set({ pageTitle: title }),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleTerminal: () => set((s) => ({ terminalOpen: !s.terminalOpen })),
  setTerminalOpen: (open) => set({ terminalOpen: open }),
  setSidebarView: (view) => set({ sidebarView: view }),
  setCommandOpen: (open) => set({ commandOpen: open }),
  setMobileSidebarView: (view) => set({ mobileSidebarView: view }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setIsFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  toggleFullscreen: async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen not supported or denied
    }
  },
  openMobileExplorer: () => set({ mobileSidebarView: "explorer" }),
  openMobileSourceControl: () => set({ mobileSidebarView: "sourceControl" }),
  focusSourceControl: (isMobile) =>
    set((s) =>
      isMobile
        ? { mobileSidebarView: "sourceControl" }
        : { sidebarView: "sourceControl", sidebarOpen: true }
    ),

  syncFromPathname: (pathname) => {
    const { _closing, _openedFromSidebar, editorGroups, activeGroupIndex } =
      get();
    if (_closing) {
      setTimeout(() => set({ _closing: false }), 0);
      return;
    }
    const navItem = matchNavItem(pathname, navItems);
    if (!navItem) {
      set({ _openedFromSidebar: null });
      return;
    }
    const group = editorGroups[activeGroupIndex];
    if (!group) {
      return;
    }
    if (group.tabs.length === 0) {
      set((s) => {
        const next = [...s.editorGroups];
        next[activeGroupIndex] = { tabs: [navItem.href], activeIndex: 0 };
        return { editorGroups: next, _openedFromSidebar: null };
      });
      return;
    }
    if (group.tabs.includes(navItem.href)) {
      const idx = group.tabs.indexOf(navItem.href);
      if (idx !== group.activeIndex) {
        set((s) => {
          const next = [...s.editorGroups];
          next[activeGroupIndex] = { ...group, activeIndex: idx };
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
      const g = next[activeGroupIndex];
      const newTabs = [...g.tabs, navItem.href];
      next[activeGroupIndex] = {
        tabs: newTabs,
        activeIndex: newTabs.length - 1,
      };
      return { editorGroups: next, _openedFromSidebar: null };
    });
  },

  openTab: (href) => {
    const { activeGroupIndex } = get();
    set({ _openedFromSidebar: href });
    set((s) => {
      const next = [...s.editorGroups];
      const g = next[activeGroupIndex];
      if (!g) {
        return s;
      }
      if (g.tabs.includes(href)) {
        const i = g.tabs.indexOf(href);
        next[activeGroupIndex] = { ...g, activeIndex: i };
      } else {
        const newTabs = [...g.tabs, href];
        next[activeGroupIndex] = {
          tabs: newTabs,
          activeIndex: newTabs.length - 1,
        };
      }
      return { editorGroups: next };
    });
  },

  closeTab: (pathname, groupIndex, href) => {
    const { editorGroups, activeGroupIndex, _router } = get();
    const group = editorGroups[groupIndex];
    if (!group) {
      return;
    }
    const idx = group.tabs.indexOf(href);
    if (idx === -1) {
      return;
    }
    const nextTabs = group.tabs.filter((h) => h !== href);
    const isActive =
      href === "/" ? pathname === "/" : pathname.startsWith(href);

    set((s) => {
      const next = [...s.editorGroups];
      if (nextTabs.length === 0) {
        next.splice(groupIndex, 1);
        if (next.length === 0) {
          return {
            editorGroups: [{ tabs: [], activeIndex: 0 }],
            activeGroupIndex: 0,
            _closing: true,
          };
        }
        return {
          editorGroups: next,
          activeGroupIndex:
            activeGroupIndex >= next.length
              ? next.length - 1
              : activeGroupIndex,
          _closing: isActive,
        };
      }
      const newActiveIndex = Math.min(idx, nextTabs.length - 1);
      next[groupIndex] = { tabs: nextTabs, activeIndex: newActiveIndex };
      return { editorGroups: next, _closing: isActive };
    });

    if (isActive && _router) {
      if (nextTabs.length > 0) {
        _router.push(nextTabs[Math.min(idx, nextTabs.length - 1)]);
      } else if (editorGroups.length > 1) {
        const otherGroup = editorGroups[groupIndex === 0 ? 1 : 0];
        const target =
          otherGroup?.tabs[otherGroup.activeIndex] ?? otherGroup?.tabs[0];
        if (target) {
          _router.push(target);
        }
      }
    }
  },

  closeAllTabs: (groupIndex) => {
    set({ _closing: true });
    if (groupIndex !== undefined) {
      set((s) => {
        const next = s.editorGroups.filter((_, i) => i !== groupIndex);
        return {
          editorGroups: next.length > 0 ? next : [{ tabs: [], activeIndex: 0 }],
          activeGroupIndex:
            s.activeGroupIndex >= groupIndex && s.activeGroupIndex > 0
              ? s.activeGroupIndex - 1
              : s.activeGroupIndex,
        };
      });
    } else {
      set({
        editorGroups: [{ tabs: [], activeIndex: 0 }],
        activeGroupIndex: 0,
      });
    }
  },

  closeGroup: (groupIndex) => {
    const { editorGroups, _router } = get();
    const group = editorGroups[groupIndex];
    if (!group || editorGroups.length <= 1) {
      return;
    }
    const targetGroupIndex = groupIndex === 0 ? 1 : 0;
    const targetGroup = editorGroups[targetGroupIndex];
    if (!targetGroup) {
      return;
    }
    const mergedTabs = [...new Set([...targetGroup.tabs, ...group.tabs])];
    set((s) => {
      const next = s.editorGroups.filter((_, i) => i !== groupIndex);
      next[0] = {
        tabs: mergedTabs,
        activeIndex: Math.min(targetGroup.activeIndex, mergedTabs.length - 1),
      };
      return { editorGroups: next, activeGroupIndex: 0, _closing: true };
    });
    const targetHref =
      targetGroup.tabs[targetGroup.activeIndex] ?? targetGroup.tabs[0];
    if (targetHref && _router) {
      _router.push(targetHref);
    }
  },

  closeOtherTabs: (pathname, groupIndex, keepHref) => {
    set((s) => {
      const next = [...s.editorGroups];
      next[groupIndex] = { tabs: [keepHref], activeIndex: 0 };
      return { editorGroups: next, _closing: true };
    });
    const isActive =
      keepHref === "/" ? pathname === "/" : pathname.startsWith(keepHref);
    if (!isActive && get()._router) {
      get()._router!.push(keepHref);
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

  splitRight: (groupIndex, href) => {
    const { _router } = get();
    set((s) => {
      const next = s.editorGroups.map((g) => ({ ...g }));
      const rightIdx = groupIndex + 1;
      if (rightIdx < next.length) {
        const right = next[rightIdx];
        if (right && !right.tabs.includes(href)) {
          next[rightIdx] = {
            tabs: [...right.tabs, href],
            activeIndex: right.tabs.length,
          };
        }
      } else {
        next.splice(groupIndex + 1, 0, { tabs: [href], activeIndex: 0 });
      }
      return { editorGroups: next, activeGroupIndex: groupIndex + 1 };
    });
    if (_router) {
      _router.push(href);
    }
  },

  splitLeft: (groupIndex, href) => {
    const { _router } = get();
    set((s) => {
      const next = s.editorGroups.map((g) => ({ ...g }));
      if (groupIndex > 0) {
        const left = next[groupIndex - 1];
        if (left && !left.tabs.includes(href)) {
          next[groupIndex - 1] = {
            tabs: [...left.tabs, href],
            activeIndex: left.tabs.length,
          };
        }
      } else {
        next.splice(0, 0, { tabs: [href], activeIndex: 0 });
      }
      return {
        editorGroups: next,
        activeGroupIndex: Math.max(0, groupIndex - 1),
      };
    });
    if (_router) {
      _router.push(href);
    }
  },

  moveTabToGroup: (targetGroupIndex, href, sourceGroupIndex) => {
    const { editorGroups, _router } = get();
    if (targetGroupIndex === sourceGroupIndex) {
      return;
    }
    const src = editorGroups[sourceGroupIndex];
    const dst = editorGroups[targetGroupIndex];
    if (!(src && dst)) {
      return;
    }
    const tabIdx = src.tabs.indexOf(href);
    if (tabIdx === -1) {
      return;
    }

    const newSrcTabs = src.tabs.filter((h) => h !== href);
    const newDstTabs = [...dst.tabs, href];
    const willRemoveSource = newSrcTabs.length === 0;
    const newTargetIdx =
      willRemoveSource && targetGroupIndex > sourceGroupIndex
        ? targetGroupIndex - 1
        : targetGroupIndex;

    set((s) => {
      const next = s.editorGroups.map((g) => ({ ...g }));
      if (newSrcTabs.length === 0) {
        next.splice(sourceGroupIndex, 1);
        next[newTargetIdx] = {
          tabs: newDstTabs,
          activeIndex: newDstTabs.length - 1,
        };
      } else {
        next[sourceGroupIndex] = {
          tabs: newSrcTabs,
          activeIndex: Math.min(src.activeIndex, newSrcTabs.length - 1),
        };
        next[targetGroupIndex] = {
          tabs: newDstTabs,
          activeIndex: newDstTabs.length - 1,
        };
      }
      return { editorGroups: next, activeGroupIndex: newTargetIdx };
    });
    if (_router) {
      _router.push(href);
    }
  },

  focusGroup: (groupIndex, href) => {
    const { editorGroups, _router } = get();
    set({ activeGroupIndex: groupIndex });
    const group = editorGroups[groupIndex];
    if (!group?.tabs.length) {
      return;
    }
    const targetHref = href ?? group.tabs[group.activeIndex] ?? group.tabs[0];
    const tabIdx = group.tabs.indexOf(targetHref);
    if (tabIdx >= 0) {
      set((s) => {
        const next = [...s.editorGroups];
        const g = next[groupIndex];
        if (g) {
          next[groupIndex] = { ...g, activeIndex: tabIdx };
        }
        return { editorGroups: next };
      });
    } else if (_router) {
      _router.push(targetHref);
    }
  },

  setSplitRatio: (ratio) => set({ splitRatio: ratio }),
}));

// Selectors
export const useActiveGroup = () =>
  useIdeStore((s) => s.editorGroups[s.activeGroupIndex]);
export const useActiveHref = () =>
  useIdeStore((s) => {
    const g = s.editorGroups[s.activeGroupIndex];
    return g?.tabs[g.activeIndex] ?? g?.tabs[0];
  });
