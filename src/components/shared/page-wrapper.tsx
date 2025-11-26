"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theming/toggle";
import { navItems } from "@/consts/nav-items";

type PageWrapperProps = {
  children: React.ReactNode;
};

export function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <nav className="-translate-x-1/2 absolute top-5 left-1/2 flex items-center gap-4 sm:top-8 sm:gap-5">
        {navItems.map((item) => (
          <Link
            className={`text-xs sm:text-sm ${
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
      {children}
    </main>
  );
}
