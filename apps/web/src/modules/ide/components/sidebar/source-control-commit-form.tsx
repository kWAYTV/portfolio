"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SourceControlCommitForm() {
  const t = useTranslations("ide");

  return (
    <div className="flex flex-col gap-1.5 border-border border-b px-2 py-2">
      <div
        className={cn(
          "flex min-h-9 min-w-0 items-center gap-2 rounded border border-input/50 px-2 py-1.5 text-[13px]",
          "cursor-not-allowed bg-muted/20 text-muted-foreground"
        )}
      >
        <span className="truncate">{t("commitMessagePlaceholder")}</span>
      </div>
      <Button
        className="h-8 w-full gap-1.5 text-[11px] disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
        disabled
        size="sm"
        type="button"
        variant="default"
      >
        <Check className="size-3.5" strokeWidth={2.5} />
        {t("commit")}
      </Button>
    </div>
  );
}
