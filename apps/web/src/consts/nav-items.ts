export interface NavItem {
  fileName: string;
  fileType: string;
  href: string;
  label: string;
}

export const navItems: NavItem[] = [
  { href: "/", label: "home", fileName: "welcome.tsx", fileType: "tsx" },
  { href: "/about", label: "about", fileName: "about.md", fileType: "md" },
  {
    href: "/projects",
    label: "projects",
    fileName: "projects.ts",
    fileType: "ts",
  },
  { href: "/blog", label: "blog", fileName: "blog.mdx", fileType: "mdx" },
];
