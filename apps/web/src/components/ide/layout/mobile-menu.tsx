"use client";

import {
  BookOpen,
  Code2,
  ExternalLink,
  FolderGit2,
  Menu,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { navItems } from "@/components/ide/config";
import { LocaleSwitcher } from "@/components/internationalization/locale-switcher";
import { ThemeToggle } from "@/components/theming/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { REPO_URL } from "@/consts/ide-constants";
import { LocaleLink } from "@/modules/i18n/routing";

const navIcons: Record<string, typeof Code2> = {
  home: Code2,
  about: User,
  projects: FolderGit2,
  blog: BookOpen,
};

interface MobileMenuProps {
  pathname: string;
}

export function MobileMenu({ pathname }: MobileMenuProps) {
  const t = useTranslations("ide");
  const tNav = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <div className="md:hidden">
        <button
          aria-label={t("openMenu")}
          className="flex size-10 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => setOpen(true)}
          type="button"
        >
          <Menu className="size-5" />
        </button>
      </div>
      <SheetContent
        className="flex w-72 flex-col gap-0 p-0 md:hidden"
        side="left"
      >
        <SheetHeader className="border-border border-b px-4 py-3">
          <SheetTitle className="font-medium text-sm">
            {tNav("menu")}
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-0 overflow-y-auto py-2">
          {navItems.map((item) => {
            const Icon = navIcons[item.label] ?? Code2;
            const active = isActive(item.href);
            return (
              <LocaleLink
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
                <span className="capitalize">{item.label}</span>
              </LocaleLink>
            );
          })}
        </nav>
        <div className="flex flex-col gap-0 border-border border-t py-2">
          <a
            className="flex items-center gap-3 px-4 py-3 text-foreground text-sm transition-colors hover:bg-muted/50"
            href={REPO_URL}
            onClick={() => setOpen(false)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExternalLink className="size-4 shrink-0" />
            {t("viewOnGitHub")}
          </a>
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <span className="text-muted-foreground text-sm">
              {tNav("language")}
            </span>
            <LocaleSwitcher />
          </div>
          <div className="px-4 py-3">
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
