"use client";

import { AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theming/toggle";
import { navItems } from "@/consts/nav-items";

type PageWrapperProps = {
  children: React.ReactNode;
};

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      className={`text-xs transition-colors sm:text-sm ${
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
      href={href}
    >
      {children}
    </Link>
  );
}

export function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <nav className="-translate-x-1/2 absolute top-4 left-1/2 flex items-center gap-3 sm:top-6 sm:gap-4">
        {navItems.map((item) => (
          <NavLink href={item.href} key={item.href}>
            {item.label}
          </NavLink>
        ))}
        <ThemeToggle />
      </nav>
      <AnimatePresence initial={false} mode="wait">
        <div key={pathname}>{children}</div>
      </AnimatePresence>
    </main>
  );
}
