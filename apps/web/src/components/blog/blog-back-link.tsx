"use client";

import { useTranslations } from "next-intl";
import { LocaleLink } from "@/modules/i18n/routing";

export function BlogBackLink() {
  const t = useTranslations("blog");

  return (
    <LocaleLink
      aria-label={t("backToBlog")}
      className="text-[10px] text-muted-foreground/70 transition-colors hover:text-muted-foreground sm:text-xs"
      href="/blog"
    >
      {t("backToBlog")}
    </LocaleLink>
  );
}
