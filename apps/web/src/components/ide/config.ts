/** Static nav items for the IDE (file tabs). */
export const navItems = [
  { href: "/", label: "home", fileName: "page.tsx", fileType: "tsx" },
  { href: "/about", label: "about", fileName: "about.md", fileType: "md" },
  {
    href: "/projects",
    label: "projects",
    fileName: "projects.ts",
    fileType: "ts",
  },
] as const;

/** Static explorer tree (no data fetching). Mimics repo structure; files without href are unaccessible. */
export type TreeItem =
  | { type: "folder"; name: string; children: TreeItem[] }
  | { type: "file"; name: string; href?: string; fileType: string };

export const explorerTree: TreeItem[] = [
  { type: "file", name: ".env", fileType: "env" },
  { type: "file", name: "package.json", fileType: "json" },
  {
    type: "folder",
    name: "src",
    children: [
      { type: "file", name: "page.tsx", href: "/", fileType: "tsx" },
      { type: "file", name: "about.md", href: "/about", fileType: "md" },
      { type: "file", name: "projects.ts", href: "/projects", fileType: "ts" },
      {
        type: "folder",
        name: "blog",
        children: [{ type: "file", name: "index.mdx", fileType: "mdx" }],
      },
    ],
  },
  { type: "file", name: "tsconfig.json", fileType: "json" },
  { type: "file", name: "README.md", fileType: "md" },
];
