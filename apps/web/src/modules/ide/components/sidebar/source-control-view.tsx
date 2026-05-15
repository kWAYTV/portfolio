"use client";

import { useCallback, useRef, useState } from "react";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { SourceControlChanges } from "@/modules/ide/components/sidebar/source-control-changes";
import { SourceControlCommitForm } from "@/modules/ide/components/sidebar/source-control-commit-form";
import { SourceControlFooter } from "@/modules/ide/components/sidebar/source-control-footer";
import { SourceControlHeader } from "@/modules/ide/components/sidebar/source-control-header";
import { SourceControlHistory } from "@/modules/ide/components/sidebar/source-control-history";
import type { Commit } from "@/modules/ide/consts/ide-constants";
import {
  getCommitsAction,
  revalidateCommitsAction,
} from "@/modules/projects/actions/github";

const REFRESH_COOLDOWN_MS = 5000;

interface SourceControlViewProps {
  fullWidth?: boolean;
  onClose?: () => void;
}

export function SourceControlView({
  fullWidth = false,
  onClose,
}: SourceControlViewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastRefreshRef = useRef(0);
  const {
    data: commits = [],
    isLoading,
    mutate,
  } = useSWR<Commit[]>("github-commits", getCommitsAction);

  const handleRefresh = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshRef.current < REFRESH_COOLDOWN_MS) {
      return;
    }
    lastRefreshRef.current = now;
    setIsRefreshing(true);
    try {
      await revalidateCommitsAction();
      await mutate();
    } finally {
      setIsRefreshing(false);
    }
  }, [mutate]);

  return (
    <div
      className={cn(
        "flex h-full select-none flex-col overflow-hidden bg-sidebar shadow-(--shadow-elevation-sm)",
        fullWidth ? "w-full min-w-0" : "w-56 shrink-0 border-border border-r"
      )}
    >
      <SourceControlHeader
        isRefreshing={isRefreshing}
        onClose={onClose}
        onRefresh={handleRefresh}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <SourceControlCommitForm />
        <SourceControlChanges />
        <SourceControlFooter />
        <SourceControlHistory commits={commits} isLoading={isLoading} />
      </div>
    </div>
  );
}
