"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function BlogBackLink() {
  const t = useTranslations("blog");

  return (
    <Link
      className="text-[10px] text-muted-foreground/50 transition-colors hover:text-muted-foreground sm:text-xs"
      href="/blog"
    >
      {t("backToBlog")}
    </Link>
  );
}
