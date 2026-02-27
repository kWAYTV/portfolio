import type { NavItem } from "@/consts/nav-items";

export function matchNavItem(pathname: string, navItems: NavItem[]) {
  return navItems.find((item) => {
    if (item.href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(item.href);
  });
}

export function getBreadcrumbParts(
  pathname: string,
  navItems: NavItem[]
): string[] {
  const parts = ["portfolio", "src"];
  const navItem = matchNavItem(pathname, navItems);
  if (navItem) {
    if (pathname.startsWith("/blog") && pathname !== "/blog") {
      parts.push("blog");
      parts.push(pathname.replace("/blog/", "") + ".mdx");
    } else if (navItem.href === "/blog") {
      parts.push("blog", "index.mdx");
    } else {
      parts.push(navItem.fileName);
    }
  }
  return parts;
}

export function getBreadcrumbPath(
  pathname: string,
  navItems: NavItem[]
): string {
  return getBreadcrumbParts(pathname, navItems).join(" / ");
}

export function copyContentToClipboard(
  mainRef: { current: HTMLElement | null },
  pathname: string,
  activeHref: string | undefined,
  pageTitle: string,
  navItems: NavItem[]
): void {
  const path = activeHref ?? pathname;
  const title =
    pageTitle || (typeof document !== "undefined" ? document.title : "");
  const breadcrumb = getBreadcrumbPath(path, navItems);
  const mainText = mainRef.current?.innerText ?? "";
  const formatted = [title, breadcrumb, mainText].filter(Boolean).join("\n\n");
  void navigator.clipboard.writeText(formatted);
}
