"use client";

import { Link } from "@i18n/routing";
import { cn } from "@portfolio/ui";
import { BookOpen, Code2, FolderGit2, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { navItems } from "@/consts/nav-items";

const navIcons: Record<string, typeof Code2> = {
  home: Code2,
  about: User,
  projects: FolderGit2,
  blog: BookOpen,
};

interface MobileNavProps {
  pathname: string;
}

export function MobileNav({ pathname }: MobileNavProps) {
  const t = useTranslations("nav");

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex h-14 shrink-0 items-center justify-around border-border border-t bg-secondary">
      {navItems.map((item) => {
        const Icon = navIcons[item.label];
        const active = isActive(item.href);
        return (
          <Link
            className={cn(
              "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 px-3 py-2 text-[10px] transition-colors touch-manipulation",
              active ? "text-primary" : "text-muted-foreground"
            )}
            href={item.href}
            key={item.href}
          >
            <Icon className="size-5" />
            <span className="capitalize">{t(item.label)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
