"use client";

import { analytics } from "@repo/analytics";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";

export function StatusBarPreviewButton() {
  const t = useTranslations("ide");

  return (
    <button
      aria-label={t("openPreview")}
      className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
      onClick={() => {
        analytics.previewWindowOpen();
        window
          .open(
            window.location.href,
            "_blank",
            "noopener,noreferrer,width=1200,height=800"
          )
          ?.focus();
      }}
      type="button"
    >
      <Play className="size-3.5 shrink-0" />
      <span className="hidden sm:inline">{t("preview")}</span>
    </button>
  );
}
