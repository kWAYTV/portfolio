"use client";

import { useTranslations } from "next-intl";
import { LocaleLink } from "@/modules/i18n/routing";

export function BlogBackLink() {
  const t = useTranslations("blog");

  return (
    <LocaleLink
      aria-label={t("backToBlog")}
      className="link-accent font-mono text-[10px] text-muted-foreground tracking-wide sm:text-xs"
      href="/blog"
    >
      {t("backToBlog")}
    </LocaleLink>
  );
}
