"use client";

import { Link, usePathname } from "@i18n/routing";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@portfolio/ui";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSelector } from "@/components/shared/language-selector";
import { ThemeToggle } from "@/components/theming/toggle";
import { navItems } from "@/consts/nav-items";

const linkClass = (active: boolean) =>
  `whitespace-nowrap text-xs sm:text-sm ${
    active
      ? "text-foreground"
      : "text-muted-foreground/60 hover:text-foreground"
  }`;

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile: hamburger + Sheet */}
      <div className="absolute top-4 left-1/2 flex w-full max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center justify-center px-2 sm:hidden">
        <Sheet onOpenChange={setOpen} open={open}>
          <SheetTrigger asChild>
            <Button
              aria-label="Open menu"
              className="text-muted-foreground"
              size="icon-sm"
              variant="ghost"
            >
              <MenuIcon className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-64" side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4 pb-4">
              {navItems.map((item) => (
                <Link
                  className={linkClass(pathname === item.href)}
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  {t(item.label)}
                </Link>
              ))}
              <span className="h-px bg-border" />
              <div className="flex items-center gap-4">
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: horizontal nav */}
      <nav className="absolute top-4 left-1/2 hidden -translate-x-1/2 items-center gap-5 sm:top-8 sm:flex sm:px-0">
        {navItems.map((item) => (
          <Link
            className={linkClass(pathname === item.href)}
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
    </>
  );
}
