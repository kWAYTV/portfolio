"use client";

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
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <nav className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          {navItems.map((item) => (
            <NavLink href={item.href} key={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>
        <ThemeToggle />
      </nav>
      {children}
    </main>
  );
}
