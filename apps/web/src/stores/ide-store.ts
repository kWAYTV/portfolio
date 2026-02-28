import { create } from "zustand";
import { explorerTree } from "@/components/ide/config";
import type { SidebarView } from "@/components/ide/shared/ide-types";
import type { ViewMode } from "@/components/ide/shared/view-mode";

function collectExpandableKeys(
  items: typeof explorerTree,
  prefix: string
): Set<string> {
  const keys = new Set<string>();
  for (const item of items) {
    if (item.type === "folder") {
      const key = `${prefix}/${item.name}`;
      keys.add(key);
      for (const k of collectExpandableKeys(item.children, key)) {
        keys.add(k);
      }
    }
  }
  return keys;
}

const ALL_EXPANDABLE_KEYS = new Set(
  collectExpandableKeys(explorerTree, "portfolio")
);

const INITIAL_EXPANDED = new Set([
  "portfolio",
  "portfolio/src",
  "portfolio/src/blog",
]);

interface IdeState {
  closeAllTabs: () => void;
  closeTab: (href: string) => void;
  collapseAll: () => void;
  exitFullscreen: () => void;
  expandAll: () => void;

  // Explorer
  expanded: Set<string>;
  isFullscreen: boolean;
  mobileSidebarView: SidebarView | null;

  openTab: (href: string) => void;

  // Tabs
  openTabs: string[];
  setFullscreen: (fullscreen: boolean) => void;
  setMobileSidebarView: (view: SidebarView | null) => void;
  setSidebarView: (view: SidebarView) => void;

  setViewMode: (mode: ViewMode) => void;
  // Layout
  sidebarOpen: boolean;
  sidebarView: SidebarView;
  terminalOpen: boolean;

  toggleExpanded: (pathKey: string) => void;
  toggleFullscreen: () => void;

  // Actions
  toggleSidebar: () => void;
  toggleTerminal: () => void;

  // View
  viewMode: ViewMode;
}

export const useIdeStore = create<IdeState>((set) => ({
  sidebarOpen: true,
  sidebarView: "explorer",
  terminalOpen: false,
  isFullscreen: false,
  mobileSidebarView: null,

  openTabs: ["/", "/about", "/projects", "/blog"],

  viewMode: "preview",

  expanded: new Set(INITIAL_EXPANDED),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  setSidebarView: (sidebarView) => set({ sidebarView }),

  toggleTerminal: () => set((s) => ({ terminalOpen: !s.terminalOpen })),

  toggleFullscreen: () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  },

  exitFullscreen: () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  },

  setFullscreen: (isFullscreen) => set({ isFullscreen }),

  setMobileSidebarView: (mobileSidebarView) => set({ mobileSidebarView }),

  openTab: (href) =>
    set((s) =>
      s.openTabs.includes(href) ? s : { openTabs: [...s.openTabs, href] }
    ),

  closeTab: (href) =>
    set((s) => ({
      openTabs: s.openTabs.filter((t) => t !== href),
    })),

  closeAllTabs: () => set({ openTabs: [] }),

  setViewMode: (viewMode) => set({ viewMode }),

  toggleExpanded: (pathKey) =>
    set((s) => {
      const next = new Set(s.expanded);
      if (next.has(pathKey)) {
        next.delete(pathKey);
      } else {
        next.add(pathKey);
      }
      return { expanded: next };
    }),

  expandAll: () =>
    set({
      expanded: new Set(["portfolio", ...ALL_EXPANDABLE_KEYS]),
    }),

  collapseAll: () => set({ expanded: new Set() }),
}));

export function useExplorerExpanded() {
  const expanded = useIdeStore((s) => s.expanded);
  const toggleExpanded = useIdeStore((s) => s.toggleExpanded);
  const expandAll = useIdeStore((s) => s.expandAll);
  const collapseAll = useIdeStore((s) => s.collapseAll);

  const isFullyExpanded =
    expanded.has("portfolio") &&
    [...ALL_EXPANDABLE_KEYS].every((k) => expanded.has(k));

  return {
    expanded,
    toggle: toggleExpanded,
    expandAll,
    collapseAll,
    isFullyExpanded,
  };
}
