"use client";

import { GitBranch, Play, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { navItems } from "@/components/ide/config";
import { LocaleSwitcher } from "@/components/internationalization/locale-switcher";
import { ThemeToggle } from "@/components/theming/theme-toggle";
import { REPO_URL } from "@/consts/ide-constants";
import { matchNavItem } from "@/lib/ide/breadcrumb";
import { cn } from "@/lib/utils";
import { useIdeStore } from "@/stores/ide-store";

const FILE_TYPE_KEYS = ["tsx", "ts", "md", "mdx", "json", "env"] as const;

interface StatusBarProps {
  onFocusSourceControl?: () => void;
  pathname: string;
}

export const StatusBar = memo(function StatusBar({
  pathname,
  onFocusSourceControl,
}: StatusBarProps) {
  const t = useTranslations("ide");
  const terminalOpen = useIdeStore((s) => s.terminalOpen);
  const toggleTerminal = useIdeStore((s) => s.toggleTerminal);

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
    <div className="flex h-11 shrink-0 select-none items-center justify-between gap-2 overflow-hidden border-border border-t bg-secondary px-2 py-1 text-[11px] text-muted-foreground shadow-(--shadow-elevation-sm) sm:h-6 sm:px-3 sm:py-0">
      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        {onFocusSourceControl ? (
          <button
            aria-label={t("sourceControl")}
            className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
            onClick={onFocusSourceControl}
            title={t("sourceControl")}
            type="button"
          >
            <GitBranch className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">main</span>
          </button>
        ) : (
          <a
            aria-label={t("openRepo")}
            className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
            href={REPO_URL}
            rel="noopener noreferrer"
            target="_blank"
            title={t("openRepo")}
          >
            <GitBranch className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">main</span>
          </a>
        )}
      </div>
      <div className="flex min-w-0 shrink-0 items-center gap-1 overflow-x-auto sm:gap-3 [&_button:hover]:text-foreground! [&_button]:min-h-[44px]! [&_button]:min-w-[44px]! [&_button]:touch-manipulation [&_button]:text-[11px]! [&_button]:text-muted-foreground! sm:[&_button]:min-h-[36px]! sm:[&_button]:min-w-[36px]!">
        <button
          aria-label={t("openPreview")}
          className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
          onClick={() => {
            window
              .open(
                window.location.href,
                "_blank",
                "noopener,noreferrer,width=1200,height=800"
              )
              ?.focus();
          }}
          title={t("openPreview")}
          type="button"
        >
          <Play className="size-3.5 shrink-0" />
          <span className="hidden sm:inline">{t("preview")}</span>
        </button>
        <button
          aria-label={t("terminal")}
          className={cn(
            "flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground",
            terminalOpen && "text-foreground"
          )}
          onClick={toggleTerminal}
          type="button"
        >
          <Terminal className="size-3.5 shrink-0" />
          <span className="hidden sm:inline">{t("terminal")}</span>
        </button>
        <span className="hidden tabular-nums sm:inline">{t("lnCol")}</span>
        <span className="hidden sm:inline">{fileType}</span>
        <div className="hidden md:flex md:items-center md:gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
});
