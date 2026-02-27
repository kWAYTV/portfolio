"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useRef } from "react";
import { useEditorGroupsStore } from "@/stores/editor-groups-store";
import { useIdeLayoutStore } from "@/stores/ide-layout-store";

interface UseIdeChromeEffectsOptions {
  fetchCommits: () => void;
  pathname: string;
  router: AppRouterInstance;
}

export function useIdeChromeEffects({
  pathname,
  router,
  fetchCommits,
}: UseIdeChromeEffectsOptions) {
  const layout = useIdeLayoutStore();
  const hasFetchedCommitsRef = useRef(false);

  useEffect(() => {
    useEditorGroupsStore.getState().setRouter(router);
    return () => useEditorGroupsStore.getState().setRouter(null);
  }, [router]);

  useEffect(() => {
    useEditorGroupsStore.getState().syncFromPathname(pathname);
  }, [pathname]);

  useEffect(() => {
    useIdeLayoutStore.getState().setMobileSidebarView(null);
  }, [pathname]);

  useEffect(() => {
    useIdeLayoutStore
      .getState()
      .setPageTitle(typeof document !== "undefined" ? document.title : "");
  }, []);

  useEffect(() => {
    if (
      (layout.sidebarView === "sourceControl" ||
        layout.mobileSidebarView === "sourceControl") &&
      !hasFetchedCommitsRef.current
    ) {
      hasFetchedCommitsRef.current = true;
      fetchCommits();
    }
  }, [layout.sidebarView, layout.mobileSidebarView, fetchCommits]);

  useEffect(() => {
    const onFullscreenChange = () => {
      useIdeLayoutStore
        .getState()
        .setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);
}
