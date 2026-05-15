"use client";

import { useTranslations } from "next-intl";
import { navItems } from "@/modules/ide/consts/navigation";
import { matchNavItem } from "@/modules/ide/lib/breadcrumb";

const FILE_TYPE_KEYS = ["tsx", "ts", "md", "mdx", "json", "env"] as const;

interface StatusBarFileInfoProps {
  pathname: string;
}

export function StatusBarFileInfo({ pathname }: StatusBarFileInfoProps) {
  const t = useTranslations("ide");

  const navItem = matchNavItem(pathname, navItems);
  const isKnownFileType =
    navItem &&
    FILE_TYPE_KEYS.includes(
      navItem.fileType as (typeof FILE_TYPE_KEYS)[number]
    );
  const fileType = isKnownFileType
    ? t(`fileType_${navItem?.fileType}` as keyof IntlMessages["ide"])
    : t("plainText");

  return (
    <>
      <span className="hidden tabular-nums sm:inline">{t("lnCol")}</span>
      <span className="hidden sm:inline">{fileType}</span>
    </>
  );
}
