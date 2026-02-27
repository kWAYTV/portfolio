"use client";

import { createContext, useContext } from "react";

export type ViewMode = "code" | "preview";

interface ViewModeContextValue {
  setViewMode: (mode: ViewMode) => void;
  viewMode: ViewMode;
}

const ViewModeContext = createContext<ViewModeContextValue>({
  viewMode: "preview",
  setViewMode: () => undefined,
});

export const useViewMode = () => useContext(ViewModeContext);
export const ViewModeProvider = ViewModeContext.Provider;
