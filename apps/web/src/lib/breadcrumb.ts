/** Strip locale prefix (e.g. /en, /es) from pathname for nav matching. */
function pathWithoutLocale(pathname: string, locales: string[]): string {
  for (const loc of locales) {
    const prefix = `/${loc}`;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return pathname.slice(prefix.length) || "/";
    }
  }
  return pathname;
}

export function matchNavItem<T extends { href: string }>(
  pathname: string,
  navItems: readonly T[],
  locales: string[] = ["en", "es"]
): T | undefined {
  const path = pathWithoutLocale(pathname, locales);
  return navItems.find((item) => {
    if (item.href === "/") {
      return path === "/";
    }
    return path.startsWith(item.href);
  });
}

export function getBreadcrumbPath(
  path: string,
  items: readonly { href: string; fileName?: string }[]
): string {
  const navItem = matchNavItem(path, items);
  if (!navItem) {
    return "portfolio";
  }
  let file: string;
  if ("fileName" in navItem && navItem.fileName) {
    file = navItem.fileName;
  } else if (navItem.href === "/") {
    file = "page.tsx";
  } else {
    file = `${navItem.href.slice(1)}.tsx`;
  }
  return ["portfolio", "src", file].join(" / ");
}

export function copyContentToClipboard(
  mainRef: { current: HTMLElement | null },
  pathname: string,
  activeHref: string | undefined,
  pageTitle: string,
  items: readonly { href: string; fileName?: string }[]
): void {
  const path = activeHref ?? pathname;
  const title =
    pageTitle || (typeof document !== "undefined" ? document.title : "");
  const breadcrumb = getBreadcrumbPath(path, items);
  const mainText = mainRef.current?.innerText ?? "";
  const formatted = [title, breadcrumb, mainText].filter(Boolean).join("\n\n");
  navigator.clipboard.writeText(formatted).catch(() => {
    /* clipboard may be denied */
  });
}
