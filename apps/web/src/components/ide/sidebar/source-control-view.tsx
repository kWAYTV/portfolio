"use client";

import { GitBranch } from "lucide-react";

interface SourceControlViewProps {
  fullWidth?: boolean;
  onClose?: () => void;
}

export function SourceControlView({
  fullWidth = false,
  onClose: _onClose,
}: SourceControlViewProps) {
  return (
    <div
      className={`flex h-full select-none flex-col overflow-hidden bg-sidebar shadow-(--shadow-elevation-sm) ${
        fullWidth ? "w-full min-w-0" : "w-56 shrink-0 border-border border-r"
      }`}
    >
      <div className="flex items-center justify-between gap-1 px-2 py-2">
        <span className="flex-1 px-2 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
          Source Control
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-muted-foreground text-xs">
        <GitBranch className="size-8" />
        <p>No changes</p>
      </div>
    </div>
  );
}
