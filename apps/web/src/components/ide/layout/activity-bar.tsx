"use client";

import { GitBranch, PanelLeft, Settings, Terminal } from "lucide-react";
import type { SidebarView } from "../shared/ide-types";
import { ActivityBarButton } from "./activity-bar-button";

interface ActivityBarProps {
  onOpenSettings?: () => void;
  onToggleSidebar: () => void;
  onToggleSidebarView: (view: SidebarView) => void;
  onToggleTerminal: () => void;
  sidebarOpen: boolean;
  sidebarView: SidebarView;
  terminalOpen: boolean;
}

export function ActivityBar({
  sidebarOpen,
  sidebarView,
  terminalOpen,
  onToggleSidebar,
  onToggleSidebarView,
  onToggleTerminal,
  onOpenSettings,
}: ActivityBarProps) {
  return (
    <div className="flex h-full w-12 shrink-0 select-none flex-col items-center border-border border-r bg-sidebar py-1 shadow-(--shadow-elevation-sm)">
      <ActivityBarButton
        active={sidebarOpen && sidebarView === "explorer"}
        icon={PanelLeft}
        onClick={() => {
          onToggleSidebarView("explorer");
          if (!sidebarOpen) {
            onToggleSidebar();
          }
        }}
        tooltip="Explorer"
      />
      <ActivityBarButton
        active={sidebarOpen && sidebarView === "sourceControl"}
        icon={GitBranch}
        onClick={() => {
          onToggleSidebarView("sourceControl");
          if (!sidebarOpen) {
            onToggleSidebar();
          }
        }}
        tooltip="Source Control"
      />
      <ActivityBarButton
        active={terminalOpen}
        icon={Terminal}
        onClick={onToggleTerminal}
        tooltip="Terminal"
      />
      <div className="mt-auto">
        <ActivityBarButton
          icon={Settings}
          onClick={() => onOpenSettings?.()}
          tooltip="Settings"
        />
      </div>
    </div>
  );
}
