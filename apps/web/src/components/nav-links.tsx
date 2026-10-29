"use client";

import { Segment } from "@/components/segment";
import { LocaleLink, useLocalePathname } from "@/modules/i18n/navigation";

export function NavLinks({
  items,
  menuLabel,
}: {
  items: Array<{ href: "/about" | "/projects"; label: string }>;
  menuLabel: string;
}) {
  const pathname = useLocalePathname();

  return (
    <Segment className="masthead-nav" label={menuLabel}>
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <LocaleLink
            aria-current={active ? "page" : undefined}
            className="control"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </LocaleLink>
        );
      })}
    </Segment>
  );
}
