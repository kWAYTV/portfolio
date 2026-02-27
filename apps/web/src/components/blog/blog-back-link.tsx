"use client";

import { Link } from "@i18n/routing";
import { useTranslations } from "next-intl";

export function BlogBackLink() {
  const t = useTranslations("blog");

  return (
    <Link
      aria-label={t("backToBlog")}
      className="text-[10px] text-muted-foreground/70 transition-colors hover:text-muted-foreground sm:text-xs"
      href="/blog"
    >
      {t("backToBlog")}
    </Link>
  );
}
