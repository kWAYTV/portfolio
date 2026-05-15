"use client";

import { memo } from "react";
import { LocaleSwitcher } from "@/modules/i18n/components/locale-switcher";
import { StatusBarBranch } from "@/modules/ide/components/layout/status-bar-branch";
import { StatusBarFileInfo } from "@/modules/ide/components/layout/status-bar-file-info";
import { StatusBarPreviewButton } from "@/modules/ide/components/layout/status-bar-preview-button";
import { StatusBarTerminalButton } from "@/modules/ide/components/layout/status-bar-terminal-button";
import { StatusBarThemeButton } from "@/modules/ide/components/layout/status-bar-theme-button";

interface StatusBarProps {
  onFocusSourceControl?: () => void;
  pathname: string;
}

export const StatusBar = memo(function StatusBar({
  pathname,
  onFocusSourceControl,
}: StatusBarProps) {
  return (
    <div className="flex h-11 shrink-0 select-none items-center justify-between gap-2 overflow-hidden border-border border-t bg-secondary px-2 py-1 text-[11px] text-muted-foreground shadow-(--shadow-elevation-sm) sm:h-6 sm:px-3 sm:py-0">
      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        <StatusBarBranch onFocusSourceControl={onFocusSourceControl} />
      </div>
      <div className="flex min-w-0 shrink-0 items-center gap-1 overflow-x-auto sm:gap-3 [&_button:hover]:text-foreground! [&_button]:min-h-[44px]! [&_button]:min-w-[44px]! [&_button]:touch-manipulation [&_button]:text-[11px]! [&_button]:text-muted-foreground! sm:[&_button]:min-h-[36px]! sm:[&_button]:min-w-[36px]!">
        <StatusBarPreviewButton />
        <StatusBarTerminalButton />
        <StatusBarFileInfo pathname={pathname} />
        <div className="hidden md:flex md:items-center md:gap-3">
          <LocaleSwitcher />
          <StatusBarThemeButton />
        </div>
      </div>
    </div>
  );
});
