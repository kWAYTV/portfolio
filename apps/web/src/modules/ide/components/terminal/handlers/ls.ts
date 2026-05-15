import {
  type CommandResult,
  out,
} from "@/modules/ide/components/terminal/handlers/types";

const RE_TRAILING_SLASHES = /\/+$/;

const DIR_CONTENTS: Record<
  string,
  { short: string[]; long: { perm: string; name: string }[] }
> = {
  "/workspace/portfolio": {
    short: ["src", ".env", "package.json", "README.md", "tsconfig.json"],
    long: [
      { perm: "drwxr-xr-x   8 visitor staff   256 Feb 27 14:32 .", name: "." },
      {
        perm: "drwxr-xr-x   3 visitor staff    96 Feb 26 09:15 ..",
        name: "..",
      },
      { perm: "drwxr-xr-x   5 visitor staff   160 Feb 27 14:30", name: "src" },
      { perm: "-rw-r--r--   1 visitor staff    42 Feb 24 11:05", name: ".env" },
      {
        perm: "-rw-r--r--   1 visitor staff  1523 Feb 27 10:12",
        name: "package.json",
      },
      {
        perm: "-rw-r--r--   1 visitor staff   156 Feb 25 16:20",
        name: "README.md",
      },
      {
        perm: "-rw-r--r--   1 visitor staff   312 Feb 26 08:44",
        name: "tsconfig.json",
      },
    ],
  },
  "/workspace/portfolio/src": {
    short: ["page.tsx", "about.mdx", "projects.ts", "blog"],
    long: [
      { perm: "drwxr-xr-x   5 visitor staff   160 Feb 27 14:30 .", name: "." },
      {
        perm: "drwxr-xr-x   8 visitor staff   256 Feb 27 14:32 ..",
        name: "..",
      },
      {
        perm: "-rw-r--r--   1 visitor staff   412 Feb 27 11:20",
        name: "page.tsx",
      },
      {
        perm: "-rw-r--r--   1 visitor staff   189 Feb 26 15:10",
        name: "about.mdx",
      },
      {
        perm: "-rw-r--r--   1 visitor staff   256 Feb 25 09:33",
        name: "projects.ts",
      },
      { perm: "drwxr-xr-x   4 visitor staff   128 Feb 27 12:05", name: "blog" },
    ],
  },
  "/workspace/portfolio/src/blog": {
    short: ["index.mdx"],
    long: [
      { perm: "drwxr-xr-x   4 visitor staff   128 Feb 27 12:05 .", name: "." },
      {
        perm: "drwxr-xr-x   5 visitor staff   160 Feb 27 14:30 ..",
        name: "..",
      },
      {
        perm: "-rw-r--r--   1 visitor staff   312 Feb 27 12:08",
        name: "index.mdx",
      },
    ],
  },
};

export function runLs(cwd: string, long: boolean): CommandResult {
  const normalized =
    cwd.replace(RE_TRAILING_SLASHES, "") || "/workspace/portfolio";
  const contents =
    DIR_CONTENTS[normalized] ?? DIR_CONTENTS["/workspace/portfolio"];
  if (long) {
    return {
      lines: [
        out("total 24"),
        ...contents.long.map((e) => out(`${e.perm} ${e.name}`)),
      ],
    };
  }
  return { lines: [out(contents.short.join("  "))] };
}
