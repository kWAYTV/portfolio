"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theming/toggle";
import { BlurFade } from "@/components/ui/blur-fade";
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
          : "text-muted-foreground/60 hover:text-foreground"
      }`}
      href={href}
    >
      {children}
      <span
        className={`-bottom-0.5 absolute inset-x-0 h-px bg-foreground/40 transition-transform duration-200 ease-out ${
          isActive ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Link>
  );
}

export function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <BlurFade
        className="-translate-x-1/2 absolute top-5 left-1/2 sm:top-8"
        delay={0}
      >
        <nav className="flex items-center gap-4 sm:gap-5">
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
        </nav>
      </BlurFade>
      {children}
    </main>
  );
}
