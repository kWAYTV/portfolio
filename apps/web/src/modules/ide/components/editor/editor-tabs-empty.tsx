"use client";

import { Code2 } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EditorTabsEmpty() {
  const t = useTranslations("ide");

  return (
    <div className="flex flex-1 flex-col">
      <div className="h-[35px] shrink-0 border-border border-b bg-muted/80 shadow-(--shadow-elevation-sm)" />
      <Empty className="border-0 p-0">
        <EmptyHeader>
          <EmptyMedia variant="default">
            <Code2 className="size-12 text-muted-foreground/50" />
          </EmptyMedia>
          <EmptyTitle>{t("noOpenEditors")}</EmptyTitle>
          <EmptyDescription>{t("openFileFromSidebar")}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
