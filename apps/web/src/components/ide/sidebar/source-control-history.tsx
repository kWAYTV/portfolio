"use client";

import { useTranslations } from "next-intl";
import { CollapsibleSection } from "@/components/ide/sidebar/collapsible-section";
import { CommitHistoryItem } from "@/components/ide/sidebar/commit-history-item";
import { SourceControlCommitHistorySkeleton } from "@/components/ide/sidebar/source-control-skeleton";
import type { Commit } from "@/consts/ide-constants";

interface SourceControlHistoryProps {
  commits: Commit[];
  isLoading: boolean;
}

export function SourceControlHistory({
  commits,
  isLoading,
}: SourceControlHistoryProps) {
  const t = useTranslations("ide");

  return (
    <div className="border-border border-t px-2 py-1">
      <CollapsibleSection defaultOpen title={t("commitHistory")}>
        <div className="max-h-32 space-y-0.5 overflow-y-auto py-1">
          {isLoading && <SourceControlCommitHistorySkeleton />}
          {!isLoading && commits.length === 0 && (
            <p className="py-1.5 pl-5 text-[13px] text-muted-foreground italic">
              {t("noChanges")}
            </p>
          )}
          {!isLoading &&
            commits.length > 0 &&
            commits.map((commit) => (
              <CommitHistoryItem commit={commit} key={commit.sha} />
            ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}
