"use client";

import { GitBranch, PanelLeft, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";
import { ActivityBarButton } from "@/components/ide/layout/activity-bar-button";
import { SettingsMenu } from "@/components/ide/layout/settings-menu";
import { useIdeStore } from "@/stores/ide-store";

export function ActivityBar() {
  const t = useTranslations("ide");
  const sidebarOpen = useIdeStore((s) => s.sidebarOpen);
  const sidebarView = useIdeStore((s) => s.sidebarView);
  const terminalOpen = useIdeStore((s) => s.terminalOpen);
  const toggleSidebar = useIdeStore((s) => s.toggleSidebar);
  const setSidebarView = useIdeStore((s) => s.setSidebarView);
  const toggleTerminal = useIdeStore((s) => s.toggleTerminal);

  return (
    <div className="flex h-full w-12 shrink-0 select-none flex-col items-center border-border border-r bg-sidebar py-1 shadow-(--shadow-elevation-sm)">
      <ActivityBarButton
        active={sidebarOpen && sidebarView === "explorer"}
        ariaLabel={t("explorer")}
        icon={PanelLeft}
        onClick={() => {
          setSidebarView("explorer");
          if (!sidebarOpen) {
            toggleSidebar();
          }
        }}
      />
      <ActivityBarButton
        active={sidebarOpen && sidebarView === "sourceControl"}
        ariaLabel={t("sourceControl")}
        icon={GitBranch}
        onClick={() => {
          setSidebarView("sourceControl");
          if (!sidebarOpen) {
            toggleSidebar();
          }
        }}
      />
      <ActivityBarButton
        active={terminalOpen}
        ariaLabel={t("terminal")}
        icon={Terminal}
        onClick={toggleTerminal}
      />
      <div className="mt-auto">
        <SettingsMenu />
      </div>
    </div>
  );
}
