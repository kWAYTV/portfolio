/** Static nav items for the IDE (file tabs). */
export const navItems = [
  { href: "/", label: "home", fileName: "page.tsx", fileType: "tsx" },
  { href: "/about", label: "about", fileName: "about.mdx", fileType: "mdx" },
  {
    href: "/projects",
    label: "projects",
    fileName: "projects.ts",
    fileType: "ts",
  },
  { href: "/blog", label: "blog", fileName: "index.mdx", fileType: "mdx" },
] as const;

export type NavItem = (typeof navItems)[number];
