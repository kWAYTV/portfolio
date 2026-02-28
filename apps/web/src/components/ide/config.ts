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

/** Static explorer tree (no data fetching). Mimics repo structure; files without href are unaccessible. */
export type TreeItem =
  | { type: "folder"; name: string; children: TreeItem[] }
  | { type: "file"; name: string; href?: string; fileType: string };

/* Folders first, then files; each group sorted alphabetically (IDE default) */
export const explorerTree: TreeItem[] = [
  {
    type: "folder",
    name: "src",
    children: [
      { type: "file", name: "page.tsx", href: "/", fileType: "tsx" },
      { type: "file", name: "about.mdx", href: "/about", fileType: "mdx" },
      { type: "file", name: "projects.ts", href: "/projects", fileType: "ts" },
      {
        type: "folder",
        name: "blog",
        children: [
          { type: "file", name: "index.mdx", href: "/blog", fileType: "mdx" },
        ],
      },
    ],
  },
  { type: "file", name: ".env", fileType: "env" },
  { type: "file", name: "package.json", fileType: "json" },
  { type: "file", name: "README.md", fileType: "md" },
  { type: "file", name: "tsconfig.json", fileType: "json" },
];
