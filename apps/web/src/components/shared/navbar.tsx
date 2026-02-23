"use client";

import { Link, usePathname } from "@i18n/routing";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "@/components/shared/language-selector";
import { ThemeToggle } from "@/components/theming/toggle";
import { navItems } from "@/consts/nav-items";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="absolute top-4 left-1/2 flex w-full max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-x-2 gap-y-1.5 px-2 sm:top-8 sm:max-w-none sm:flex-nowrap sm:gap-x-5 sm:gap-y-0 sm:px-0">
      {navItems.map((item) => (
        <Link
          className={`whitespace-nowrap text-xs sm:text-sm ${
            pathname === item.href
              ? "text-foreground"
              : "text-muted-foreground/60 hover:text-foreground"
          }`}
          href={item.href}
          key={item.href}
        >
          {t(item.label)}
        </Link>
      ))}
      <span className="mx-1 h-3 w-px bg-border" />
      <LanguageSelector />
      <span className="mx-1 h-3 w-px bg-border" />
      <ThemeToggle />
    </nav>
  );
}
