"use client";

import { analytics } from "@repo/analytics";
import { GitBranch } from "lucide-react";
import { useTranslations } from "next-intl";
import { REPO_URL } from "@/modules/ide/consts/ide-constants";

interface StatusBarBranchProps {
  onFocusSourceControl?: () => void;
}

export function StatusBarBranch({
  onFocusSourceControl,
}: StatusBarBranchProps) {
  const t = useTranslations("ide");

  if (onFocusSourceControl) {
    return (
      <button
        aria-label={t("sourceControl")}
        className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
        onClick={onFocusSourceControl}
        type="button"
      >
        <GitBranch className="size-3.5 shrink-0" />
        <span className="hidden sm:inline">main</span>
      </button>
    );
  }

  return (
    <a
      aria-label={t("openRepo")}
      className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
      href={REPO_URL}
      onClick={() => analytics.viewOnGitHub("status-bar")}
      rel="noopener noreferrer"
      target="_blank"
    >
      <GitBranch className="size-3.5 shrink-0" />
      <span className="hidden sm:inline">main</span>
    </a>
  );
}
