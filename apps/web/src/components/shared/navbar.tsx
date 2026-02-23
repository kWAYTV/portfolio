"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theming/toggle";
import { navItems } from "@/consts/nav-items";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="-translate-x-1/2 absolute top-4 left-1/2 flex items-center gap-2.5 px-2 sm:top-8 sm:gap-5 sm:px-0">
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
          {item.label}
        </Link>
      ))}
      <span className="mx-1 h-3 w-px bg-border" />
      <ThemeToggle />
    </nav>
  );
}
