"use client";

import { AnimatePresence, motion } from "motion/react";
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
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      className={`relative px-0.5 py-1 text-xs transition-colors duration-200 sm:text-sm ${
        isActive
          ? "text-foreground"
          : "text-muted-foreground/70 hover:text-foreground"
      }`}
      href={href}
    >
      {children}
      {isActive && (
        <motion.span
          className="-bottom-0.5 absolute inset-x-0 h-px bg-foreground/40"
          layoutId="nav-indicator"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

export function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <motion.nav
        animate={{ opacity: 1, y: 0 }}
        className="-translate-x-1/2 absolute top-5 left-1/2 flex items-center gap-4 sm:top-8 sm:gap-5"
        initial={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, ease: [0.26, 1, 0.6, 1] }}
      >
        {navItems.map((item) => (
          <NavLink
            href={item.href}
            isActive={pathname === item.href}
            key={item.href}
          >
            {item.label}
          </NavLink>
        ))}
        <span className="mx-1 h-3 w-px bg-border" />
        <ThemeToggle />
      </motion.nav>
      <AnimatePresence initial={false} mode="wait">
        <div key={pathname}>{children}</div>
      </AnimatePresence>
    </main>
  );
}
