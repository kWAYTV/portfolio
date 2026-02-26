"use client";

import { Link } from "@i18n/routing";
import { cn } from "@portfolio/ui";
import { BookOpen, Code2, FolderGit2, GitBranch, Terminal, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { navItems } from "@/consts/nav-items";
import { LanguageSelector } from "@/components/shared/language-selector";
import { ThemeToggle } from "@/components/theming/toggle";

const navIcons: Record<string, typeof Code2> = {
  home: Code2,
  about: User,
  projects: FolderGit2,
  blog: BookOpen,
};

const PORTFOLIO_REPO_URL = "https://github.com/kWAYTV/portfolio";

interface MobileFooterProps {
  onToggleTerminal: () => void;
  pathname: string;
  terminalOpen: boolean;
}

export function MobileFooter({
  pathname,
  terminalOpen,
  onToggleTerminal,
}: MobileFooterProps) {
  const t = useTranslations("nav");

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-1 border-border border-t bg-secondary px-2 pb-[env(safe-area-inset-bottom)] md:hidden">
      <a
        className="flex size-10 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground"
        href={PORTFOLIO_REPO_URL}
        rel="noopener noreferrer"
        target="_blank"
      >
        <GitBranch className="size-4" />
      </a>
      <nav className="flex min-w-0 flex-1 items-center justify-center gap-0.5">
        {navItems.map((item) => {
          const Icon = navIcons[item.label];
          const active = isActive(item.href);
          return (
            <Link
              className={cn(
                "flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-sm px-1 py-2 text-[10px] transition-colors touch-manipulation",
                active ? "bg-muted/80 text-primary" : "text-muted-foreground"
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="size-5 shrink-0" />
              <span className="truncate capitalize">{t(item.label)}</span>
            </Link>
          );
        })}
      </nav>
      <div className="flex shrink-0 items-center gap-0.5">
        <button
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground",
            terminalOpen && "bg-muted/60 text-foreground"
          )}
          onClick={onToggleTerminal}
          type="button"
        >
          <Terminal className="size-4" />
        </button>
        <div className="flex [&_button]:size-10 [&_button]:min-w-[44px]">
          <LanguageSelector />
        </div>
        <div className="flex [&_button]:size-10 [&_button]:min-w-[44px]">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
