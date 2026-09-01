"use client";

import { LocaleLink, useLocalePathname } from "@/modules/i18n/routing";

export function NavLinks({
  items,
  menuLabel,
}: {
  items: Array<{ href: "/about" | "/projects" | "/blog"; label: string }>;
  menuLabel: string;
}) {
  const pathname = useLocalePathname();

  return (
    <nav aria-label={menuLabel} className="masthead-nav">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <LocaleLink
            aria-current={active ? "page" : undefined}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </LocaleLink>
        );
      })}
    </nav>
  );
}
