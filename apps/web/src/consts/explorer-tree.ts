export interface FileItem {
  fileType: string;
  href?: string;
  name: string;
  type: "file";
}

export interface FolderItem {
  children: TreeItem[];
  name: string;
  type: "folder";
}

export type TreeItem = FileItem | FolderItem;

export const explorerTree: TreeItem[] = [
  { name: ".env", type: "file", fileType: "env" },
  { name: "package.json", type: "file", fileType: "json" },
  {
    name: "src",
    type: "folder",
    children: [
      { name: "welcome.tsx", type: "file", fileType: "tsx", href: "/" },
      { name: "about.md", type: "file", fileType: "md", href: "/about" },
      {
        name: "projects.ts",
        type: "file",
        fileType: "ts",
        href: "/projects",
      },
      {
        name: "blog",
        type: "folder",
        children: [
          {
            name: "index.mdx",
            type: "file",
            fileType: "mdx",
            href: "/blog",
          },
        ],
      },
    ],
  },
  { name: "tsconfig.json", type: "file", fileType: "json" },
  { name: "README.md", type: "file", fileType: "md" },
];
