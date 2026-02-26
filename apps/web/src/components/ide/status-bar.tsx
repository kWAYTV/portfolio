"use client";

import { Link } from "@i18n/routing";
import { cn } from "@portfolio/ui";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  GitBranch,
  Play,
  Rss,
  Terminal,
} from "lucide-react";
import { LanguageSelector } from "@/components/shared/language-selector";
import { ThemeToggle } from "@/components/theming/toggle";
import { navItems } from "@/consts/nav-items";

const fileTypeLabels: Record<string, string> = {
  tsx: "TypeScript React",
  ts: "TypeScript",
  md: "Markdown",
  mdx: "MDX",
};

interface StatusBarProps {
  onToggleTerminal: () => void;
  pathname: string;
  terminalOpen: boolean;
}

export function StatusBar({
  pathname,
  terminalOpen,
  onToggleTerminal,
}: StatusBarProps) {
  const navItem = navItems.find((item) => {
    if (item.href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(item.href);
  });

  const t = useTranslations("ide");
  const fileType = navItem
    ? (fileTypeLabels[navItem.fileType] ?? "Plain Text")
    : "Plain Text";

  return (
    <div className="flex h-11 shrink-0 select-none items-center justify-between gap-2 overflow-hidden border-border border-t bg-secondary px-2 py-1 text-[11px] text-muted-foreground sm:h-6 sm:px-3 sm:py-0">
      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        <a
          className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
          href="https://github.com/kWAYTV/portfolio"
          rel="noopener noreferrer"
          target="_blank"
          title={t("openRepo")}
        >
          <GitBranch className="size-3.5 shrink-0" />
          <span className="hidden sm:inline">main</span>
        </a>
        <span className="hidden items-center gap-1 sm:flex">
          <CheckCircle2 className="size-3" />0
        </span>
      </div>
      <div className="flex min-w-0 shrink-0 items-center gap-1 overflow-x-auto sm:gap-3 [&_button]:!text-[length:11px] [&_button]:!text-muted-foreground [&_button:hover]:!text-foreground [&_button]:min-h-[44px] [&_button]:min-w-[44px] [&_button]:touch-manipulation [&_a]:flex [&_a]:min-h-[44px] [&_a]:min-w-[44px] [&_a]:items-center [&_a]:touch-manipulation sm:[&_button]:min-h-[36px] sm:[&_button]:min-w-[36px] sm:[&_a]:min-h-[36px] sm:[&_a]:min-w-[36px]">
        <button
          className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
          onClick={() => {
            const w = window.open(
              typeof window !== "undefined" ? window.location.href : "/",
              "_blank",
              "noopener,noreferrer,width=1200,height=800"
            );
            w?.focus();
          }}
          title={t("openPreview")}
          type="button"
        >
          <Play className="size-3.5" />
          <span className="hidden sm:inline">{t("preview")}</span>
        </button>
        <button
          className={cn(
            "flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground",
            terminalOpen && "text-foreground"
          )}
          onClick={onToggleTerminal}
          type="button"
        >
          <Terminal className="size-3.5" />
          <span className="hidden sm:inline">{t("terminal")}</span>
        </button>
        <span className="hidden tabular-nums sm:inline">Ln 1, Col 1</span>
        <span className="hidden sm:inline">{fileType}</span>
        <Link
          className="flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground"
          href="/rss"
        >
          <Rss className="size-3.5 shrink-0" />
          <span className="hidden sm:inline">RSS</span>
        </Link>
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </div>
  );
}
