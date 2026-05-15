"use client";

import { useIdeStore } from "@/modules/ide/stores/ide-store";

export type ViewMode = "code" | "preview";

export const useViewMode = () => ({
  viewMode: useIdeStore((s) => s.viewMode),
  setViewMode: useIdeStore((s) => s.setViewMode),
});
