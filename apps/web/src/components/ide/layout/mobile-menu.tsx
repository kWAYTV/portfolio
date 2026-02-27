"use client";

import { Link } from "@i18n/routing";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@portfolio/ui";
import {
  BookOpen,
  Code2,
  ExternalLink,
  FolderGit2,
  GitBranch,
  Menu,
  PanelLeft,
  Terminal,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";
import { LanguageSelector } from "@/components/shared/language-selector";
import { ThemeSelector } from "@/components/shared/theme-selector";
import { ThemeToggle } from "@/components/theming/toggle";
import { navItems } from "@/consts/nav-items";

const navIcons: Record<string, typeof Code2> = {
  home: Code2,
  about: User,
  projects: FolderGit2,
  blog: BookOpen,
};

const PORTFOLIO_REPO_URL = "https://github.com/kWAYTV/portfolio";

interface MobileMenuProps {
  onOpenExplorer: () => void;
  onOpenSourceControl: () => void;
  onToggleTerminal: () => void;
  pathname: string;
  terminalOpen: boolean;
}

export const MobileMenu = memo(function MobileMenu({
  pathname,
  terminalOpen,
  onToggleTerminal,
  onOpenExplorer,
  onOpenSourceControl,
}: MobileMenuProps) {
  const t = useTranslations("nav");
  const tIde = useTranslations("ide");
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="flex size-10 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:hidden"
          type="button"
        >
          <Menu className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        className="flex w-72 flex-col gap-0 p-0 md:hidden"
        showCloseButton={true}
        side="left"
      >
        <SheetHeader className="border-border border-b px-4 py-3">
          <SheetTitle className="font-medium text-sm">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-0 overflow-y-auto py-2">
          {navItems.map((item) => {
            const Icon = navIcons[item.label];
            const active = isActive(item.href);
            return (
              <Link
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active
                    ? "bg-muted/80 text-primary"
                    : "text-foreground hover:bg-muted/50"
                }`}
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                <Icon className="size-4 shrink-0" />
                <span className="capitalize">{t(item.label)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col gap-0 border-border border-t py-2">
          <button
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50 text-foreground"
            onClick={() => {
              onOpenExplorer();
              setOpen(false);
            }}
            type="button"
          >
            <PanelLeft className="size-4 shrink-0" />
            {tIde("explorer")}
          </button>
          <button
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50 text-foreground"
            onClick={() => {
              onOpenSourceControl();
              setOpen(false);
            }}
            type="button"
          >
            <GitBranch className="size-4 shrink-0" />
            {tIde("sourceControl")}
          </button>
          <a
            className="flex items-center gap-3 px-4 py-3 text-foreground text-sm transition-colors hover:bg-muted/50"
            href={PORTFOLIO_REPO_URL}
            onClick={() => setOpen(false)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExternalLink className="size-4 shrink-0" />
            {tIde("viewOnGitHub")}
          </a>
          <button
            className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50 ${
              terminalOpen ? "bg-muted/60 text-foreground" : "text-foreground"
            }`}
            onClick={() => {
              onToggleTerminal();
              setOpen(false);
            }}
            type="button"
          >
            <Terminal className="size-4 shrink-0" />
            Terminal
          </button>
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <span className="text-muted-foreground text-sm">Language</span>
            <LanguageSelector />
          </div>
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <span className="text-muted-foreground text-sm">Theme</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <span className="text-muted-foreground text-sm">{tIde("themePreset")}</span>
            <ThemeSelector />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});
