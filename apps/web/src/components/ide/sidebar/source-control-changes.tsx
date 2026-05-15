"use client";

import { useTranslations } from "next-intl";
import { CollapsibleSection } from "@/components/ide/sidebar/collapsible-section";

export function SourceControlChanges() {
  const t = useTranslations("ide");

  return (
    <div className="flex-1 overflow-y-auto px-2 py-1">
      <CollapsibleSection defaultOpen title={`${t("changes")} (0)`}>
        <p className="py-1.5 pl-5 text-[13px] text-muted-foreground italic">
          {t("noChangesWorkingTree")}
        </p>
      </CollapsibleSection>
    </div>
  );
}
