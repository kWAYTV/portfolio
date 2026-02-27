"use client";

import { usePathname } from "@i18n/routing";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SidebarView } from "@/components/ide/shared/ide-types";
import type { ViewMode } from "@/components/ide/shared/view-mode";
import { navItems } from "@/consts/nav-items";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { getBreadcrumbPath } from "@/lib/ide/breadcrumb";

export function useIdeLayoutState(activeHref: string | undefined) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarView, setSidebarView] = useState<SidebarView>("explorer");
  const [mobileSidebarView, setMobileSidebarView] =
    useState<SidebarView | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const mainRef = useRef<HTMLElement>(null);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const toggleTerminal = useCallback(() => {
    setTerminalOpen((prev) => !prev);
  }, []);

  const openMobileExplorer = useCallback(() => {
    setMobileSidebarView("explorer");
  }, []);

  const openMobileSourceControl = useCallback(() => {
    setMobileSidebarView("sourceControl");
  }, []);

  useEffect(() => {
    setPageTitle(typeof document !== "undefined" ? document.title : "");
  }, []);

  useEffect(() => {
    setMobileSidebarView(null);
  }, [pathname]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen not supported or denied
    }
  }, []);

  const copyContent = useCallback(() => {
    const path = activeHref ?? pathname;
    const title =
      pageTitle || (typeof document !== "undefined" ? document.title : "");
    const breadcrumb = getBreadcrumbPath(path, navItems);
    const mainText = mainRef.current?.innerText ?? "";
    const formatted = [title, breadcrumb, mainText]
      .filter(Boolean)
      .join("\n\n");
    void navigator.clipboard.writeText(formatted);
  }, [pathname, pageTitle, activeHref]);

  const focusSourceControl = useCallback(() => {
    if (isMobile) {
      setMobileSidebarView("sourceControl");
    } else {
      setSidebarView("sourceControl");
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return {
    commandOpen,
    copyContent,
    focusSourceControl,
    mainRef,
    mobileSidebarView,
    openMobileExplorer,
    openMobileSourceControl,
    pageTitle,
    setCommandOpen,
    setMobileSidebarView,
    setPageTitle,
    setSidebarView,
    setTerminalOpen,
    setViewMode,
    sidebarOpen,
    sidebarView,
    terminalOpen,
    toggleFullscreen,
    toggleSidebar,
    toggleTerminal,
    viewMode,
    isFullscreen,
  };
}
