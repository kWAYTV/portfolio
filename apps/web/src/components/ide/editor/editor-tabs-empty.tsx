"use client";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@portfolio/ui";
import { Code2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function EditorTabsEmpty() {
  const t = useTranslations("ide");

  return (
    <div className="flex flex-1 flex-col">
      <div className="h-[35px] shrink-0 border-border border-b bg-muted/80 shadow-[var(--shadow-elevation-sm)]" />
      <Empty className="flex-1 border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Code2 />
          </EmptyMedia>
          <EmptyTitle className="text-sm">{t("noOpenEditors")}</EmptyTitle>
          <EmptyDescription className="text-xs">
            {t("openFileFromSidebar")}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
