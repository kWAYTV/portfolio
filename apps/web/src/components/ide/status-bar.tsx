"use client";

import { Link } from "@i18n/routing";
import { cn } from "@portfolio/ui";
import { CheckCircle2, GitBranch, Rss, Terminal } from "lucide-react";
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

  const fileType = navItem
    ? (fileTypeLabels[navItem.fileType] ?? "Plain Text")
    : "Plain Text";

  return (
    <div className="flex h-8 shrink-0 select-none items-center justify-between border-border border-t bg-secondary px-3 py-1 text-[11px] text-muted-foreground sm:h-6 sm:px-2 sm:py-0">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <GitBranch className="size-3.5" />
          main
        </span>
        <span className="hidden items-center gap-1 sm:flex">
          <CheckCircle2 className="size-3" />0
        </span>
      </div>
      <div className="[&_button]:!text-[length:11px] [&_button]:!text-muted-foreground [&_button:hover]:!text-foreground [&_button]:min-h-[36px] [&_button]:min-w-[36px] [&_button]:touch-manipulation [&_a]:min-h-[36px] [&_a]:min-w-[36px] [&_a]:flex [&_a]:items-center [&_a]:touch-manipulation flex items-center gap-2 sm:gap-3">
        <button
          className={cn(
            "flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground",
            terminalOpen && "text-foreground"
          )}
          onClick={onToggleTerminal}
          type="button"
        >
          <Terminal className="size-3.5" />
          <span className="hidden sm:inline">Terminal</span>
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
