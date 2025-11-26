"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theming/toggle";

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
  return (
    <main className="relative flex min-h-svh items-center justify-center px-4 sm:px-6">
      <nav className="absolute top-4 right-4 left-4 flex items-center justify-between sm:top-6 sm:right-6 sm:left-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <NavLink href="/">home</NavLink>
          <NavLink href="/about">about</NavLink>
          <NavLink href="/blog">blog</NavLink>
        </div>
        <ThemeToggle />
      </nav>
      {children}
    </main>
  );
}
