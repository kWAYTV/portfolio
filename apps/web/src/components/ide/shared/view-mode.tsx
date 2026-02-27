"use client";

import { useIdeStore } from "@/stores/ide-store";

export type ViewMode = "code" | "preview";

export const useViewMode = () => ({
  viewMode: useIdeStore((s) => s.viewMode),
  setViewMode: useIdeStore((s) => s.setViewMode),
});
