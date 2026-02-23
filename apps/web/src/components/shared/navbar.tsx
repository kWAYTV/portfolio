"use client";

import { Link, usePathname } from "@i18n/routing";
import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@portfolio/ui";
import { MenuIcon, XIcon } from "lucide-react";
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
      <div className="absolute top-3 left-4 sm:hidden">
        <Sheet onOpenChange={setOpen} open={open}>
          <SheetTrigger asChild>
            <Button
              aria-expanded={open}
              aria-label={t("menu")}
              className="text-muted-foreground"
              size="icon-sm"
              variant="ghost"
            >
              <MenuIcon aria-hidden className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="flex w-[280px] flex-col gap-0 border-r p-0 sm:max-w-[280px]"
            showCloseButton={false}
            side="left"
          >
            <SheetHeader className="flex flex-row items-center justify-between gap-4 border-b px-4 py-3">
              <SheetTitle className="font-medium text-sm">
                {t("menu")}
              </SheetTitle>
              <SheetClose asChild>
                <Button
                  aria-label="Close menu"
                  className="size-8 shrink-0 text-muted-foreground"
                  size="icon-sm"
                  variant="ghost"
                >
                  <XIcon className="size-4" />
                </Button>
              </SheetClose>
            </SheetHeader>
            <nav
              aria-label="Main navigation"
              className="flex flex-col px-2 py-2"
            >
              {navItems.map((item) => (
                <Link
                  className={`rounded-sm px-2 py-2 text-sm ${linkClass(pathname === item.href)}`}
                  href={item.href}
                  key={item.href}
                  onClick={() => setOpen(false)}
                >
                  {t(item.label)}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex items-center justify-between gap-4 border-t px-4 py-3">
              <LanguageSelector />
              <ThemeToggle />
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
