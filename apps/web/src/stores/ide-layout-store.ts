"use client";

import { create } from "zustand";
import type { SidebarView } from "@/components/ide/shared/ide-types";
import type { ViewMode } from "@/components/ide/shared/view-mode";

interface IdeLayoutState {
  commandOpen: boolean;
  isFullscreen: boolean;
  mobileSidebarView: SidebarView | null;
  pageTitle: string;
  sidebarOpen: boolean;
  sidebarView: SidebarView;
  terminalOpen: boolean;
  viewMode: ViewMode;
}

type IdeLayoutActions = {
  setPageTitle: (title: string) => void;
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
};

export const useIdeLayoutStore = create<IdeLayoutState & IdeLayoutActions>(
  (set) => ({
    sidebarOpen: true,
    sidebarView: "explorer",
    mobileSidebarView: null,
    terminalOpen: false,
    commandOpen: false,
    isFullscreen: false,
    viewMode: "preview",
    pageTitle: "",

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
  })
);
