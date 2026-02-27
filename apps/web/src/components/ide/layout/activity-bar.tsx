"use client";

import { GitBranch, PanelLeft, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";
import type { SidebarView } from "@/components/ide/shared/ide-types";
import { ActivityBarButton } from "@/components/ide/layout/activity-bar-button";
import { ActivityBarSettingsMenu } from "@/components/ide/layout/activity-bar-settings-menu";

interface ActivityBarProps {
  onOpenCommand: () => void;
  onToggleSidebar: () => void;
  onToggleSidebarView: (view: SidebarView) => void;
  onToggleTerminal: () => void;
  pathname: string;
  sidebarOpen: boolean;
  sidebarView: SidebarView;
  terminalOpen: boolean;
}

export const ActivityBar = memo(function ActivityBar({
  pathname,
  sidebarOpen,
  sidebarView,
  terminalOpen,
  onOpenCommand,
  onToggleSidebar,
  onToggleSidebarView,
  onToggleTerminal,
}: ActivityBarProps) {
  const t = useTranslations("ide");

  return (
    <div className="flex h-full w-12 shrink-0 select-none flex-col items-center border-border border-r bg-sidebar py-1 shadow-[var(--shadow-elevation-sm)]">
      <ActivityBarButton
        active={sidebarOpen && sidebarView === "explorer"}
        icon={PanelLeft}
        onClick={() => {
          onToggleSidebarView("explorer");
          if (!sidebarOpen) onToggleSidebar();
        }}
        tooltip={t("explorer")}
      />
      <ActivityBarButton
        active={sidebarOpen && sidebarView === "sourceControl"}
        icon={GitBranch}
        onClick={() => {
          onToggleSidebarView("sourceControl");
          if (!sidebarOpen) onToggleSidebar();
        }}
        tooltip={t("sourceControl")}
      />
      <ActivityBarButton
        active={terminalOpen}
        icon={Terminal}
        onClick={onToggleTerminal}
        tooltip={t("terminal")}
      />
      <div className="mt-auto">
        <ActivityBarSettingsMenu
          onOpenCommand={onOpenCommand}
          pathname={pathname}
        />
      </div>
    </div>
  );
});
