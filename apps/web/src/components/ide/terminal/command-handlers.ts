/** Mock file contents for cat command */
const MOCK_FILE_CONTENTS: Record<string, string> = {
  "package.json": `{
  "name": "ide-portfolio",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "type": "module",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build"
  }
}`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2017",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["./**/*.ts", "./**/*.tsx"]
}`,
  "README.md": `# ide-portfolio

Portfolio built as an IDE-inspired experience.
`,
  ".env": "# Env vars (redacted)",
  "page.tsx": `export default function Page() {
  return <main>Home</main>;
}`,
  "about.mdx": `# About

Portfolio about page.`,
  "projects.ts": "export const projects = [];",
  "src/page.tsx": `export default function Page() {
  return <main>Home</main>;
}`,
  "src/about.mdx": "# About",
  "src/projects.ts": "export const projects = [];",
  "src/blog/index.mdx": "# Blog",
};

const RE_WHITESPACE = /\s+/;
const RE_TILDE_PREFIX = /^~\//;
const RE_WORKSPACE_PREFIX = /^\/workspace\/portfolio\/?/;
const RE_TRAILING_SLASH = /\/[^/]+$/;
const RE_SLASHES = /\/+/g;
const RE_TRAILING_SLASHES = /\/+$/;
const RE_MSG_QUOTES = /^["']|["']$/g;

function randomHash(): string {
  return [...crypto.getRandomValues(new Uint8Array(4))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 7);
}

export interface CommandResult {
  cwd?: string;
  lines: { type: "input" | "output" | "error"; content: string }[];
}

type LineType = "input" | "output" | "error";
const out = (s: string): { type: LineType; content: string } => ({
  type: "output",
  content: s,
});
const err = (s: string): { type: LineType; content: string } => ({
  type: "error",
  content: s,
});

function runCat(parts: string[]): CommandResult {
  const file = parts[1];
  if (!file) {
    return { lines: [err("cat: missing file operand")] };
  }
  const normalized =
    file.replace(RE_TILDE_PREFIX, "").replace(RE_WORKSPACE_PREFIX, "") || ".";
  const content = MOCK_FILE_CONTENTS[normalized] ?? MOCK_FILE_CONTENTS[file];
  if (content) {
    return { lines: content.split("\n").map(out) };
  }
  return { lines: [err(`cat: ${file}: No such file or directory`)] };
}

const DIR_CONTENTS: Record<
  string,
  { short: string[]; long: { perm: string; name: string }[] }
> = {
  "/workspace/portfolio": {
    short: ["package.json", "tsconfig.json", "README.md", "src", ".env"],
    long: [
      { perm: "drwxr-xr-x   8 visitor staff   256 Feb 27 14:32 .", name: "." },
      {
        perm: "drwxr-xr-x   3 visitor staff    96 Feb 26 09:15 ..",
        name: "..",
      },
      {
        perm: "-rw-r--r--   1 visitor staff  1523 Feb 27 10:12",
        name: "package.json",
      },
      {
        perm: "-rw-r--r--   1 visitor staff   312 Feb 26 08:44",
        name: "tsconfig.json",
      },
      {
        perm: "-rw-r--r--   1 visitor staff   156 Feb 25 16:20",
        name: "README.md",
      },
      { perm: "drwxr-xr-x   5 visitor staff   160 Feb 27 14:30", name: "src" },
      { perm: "-rw-r--r--   1 visitor staff    42 Feb 24 11:05", name: ".env" },
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

function runLs(cwd: string, long: boolean): CommandResult {
  const normalized =
    cwd.replace(RE_TRAILING_SLASHES, "") || "/workspace/portfolio";
  const contents =
    DIR_CONTENTS[normalized] ?? DIR_CONTENTS["/workspace/portfolio"]; // fallback for unknown dirs
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

function runCd(parts: string[], cwd: string): CommandResult {
  const dir = parts[1] ?? "~";
  if (dir === "~" || dir === "~/") {
    return { lines: [], cwd: "/workspace/portfolio" };
  }
  if (dir === "..") {
    const next = cwd.replace(RE_TRAILING_SLASH, "") || "/workspace";
    return { lines: [], cwd: next };
  }
  if (dir === ".") {
    return { lines: [], cwd };
  }
  const next = dir.startsWith("/") ? dir : `${cwd}/${dir}`;
  return { lines: [], cwd: next.replace(RE_SLASHES, "/") };
}

function runGit(parts: string[]): CommandResult {
  const sub = parts[1]?.toLowerCase();
  if (sub === "status") {
    return {
      lines: [
        out("On branch main"),
        out("Your branch is up to date with 'origin/main'."),
        out(""),
        out("Changes not staged for commit:"),
        out('  (use "git add <file>..." to update what will be committed)'),
        out("  modified:   apps/web/src/components/ide/ide-layout.tsx"),
        out("  modified:   apps/web/src/stores/ide-store.ts"),
        out(""),
        out(
          'no changes added to commit (use "git add" and/or "git commit -a")'
        ),
      ],
    };
  }
  if (sub === "commit") {
    const mIdx = parts.indexOf("-m");
    const msg =
      mIdx >= 0
        ? parts
            .slice(mIdx + 1)
            .join(" ")
            .replace(RE_MSG_QUOTES, "")
            .trim() || null
        : null;
    if (msg) {
      const files = 1 + Math.floor(Math.random() * 5);
      const ins = Math.floor(Math.random() * 120) + 1;
      const del = Math.floor(Math.random() * 40);
      return {
        lines: [
          out(`[main ${randomHash()}] ${msg}`),
          out(
            ` ${files} file${files > 1 ? "s" : ""} changed, ${ins} insertion${ins !== 1 ? "s" : ""}(+), ${del} deletion${del !== 1 ? "s" : ""}(-)`
          ),
        ],
      };
    }
    return {
      lines: [
        out("Conventional commit format:"),
        out('  git commit -m "feat: add feature"'),
        out('  git commit -m "fix: resolve bug"'),
        out('  git commit -m "docs: update readme"'),
        out("  Types: feat|fix|docs|style|refactor|perf|test|build|ci|chore"),
      ],
    };
  }
  if (sub === "log") {
    return {
      lines: [
        out(`commit ${randomHash()} (HEAD -> main, origin/main)`),
        out("Author: Developer <dev@example.com>"),
        out("Date:   Fri Feb 27 2025"),
        out(""),
        out("    feat(ide): add zustand store for layout state"),
      ],
    };
  }
  return {
    lines: [err(`git: '${sub ?? ""}' is not a git command`)],
  };
}

export function executeCommand(cmd: string, cwd: string): CommandResult {
  const trimmed = cmd.trim();
  const parts = trimmed.split(RE_WHITESPACE);
  const cmdName = parts[0]?.toLowerCase() ?? "";

  switch (cmdName) {
    case "clear":
      return { lines: [] };
    case "pwd":
      return { lines: [out(cwd.replace("/workspace/portfolio", "~"))] };
    case "ls":
      return runLs(cwd, false);
    case "ls -la":
    case "ls -l":
    case "ls -a":
      return runLs(cwd, true);
    case "whoami":
      return { lines: [out("visitor")] };
    case "help":
    case "?":
      return {
        lines: [
          out("Available commands:"),
          out(""),
          out("  git status           Show working tree status"),
          out(
            '  git commit -m "msg"   Conventional commit (feat|fix|docs|...)'
          ),
          out(""),
          out("  cat <file>           Display file"),
          out("  echo <text>           Echo text"),
          out("  clear                Clear terminal"),
          out("  ls, ls -la           List files"),
          out("  pwd                  Print working directory"),
          out("  cd <dir>             Change directory"),
          out("  help, ?              Show this help"),
        ],
      };
    case "cat":
      return runCat(parts);
    case "echo":
      return { lines: [out(parts.slice(1).join(" "))] };
    case "cd":
      return runCd(parts, cwd);
    case "git":
      return runGit(parts);
    default:
      if (!trimmed) {
        return { lines: [] };
      }
      return {
        lines: [err(`${parts[0] ?? cmd}: command not found`)],
      };
  }
}
