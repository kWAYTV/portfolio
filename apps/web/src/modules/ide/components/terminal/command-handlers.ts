type Translate = (
  key: string,
  values?: Record<string, string | number>
) => string;

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

function runCat(parts: string[], t: Translate): CommandResult {
  const file = parts[1];
  if (!file) {
    return { lines: [err(t("cmdOutput.catMissingOperand"))] };
  }
  const normalized =
    file.replace(RE_TILDE_PREFIX, "").replace(RE_WORKSPACE_PREFIX, "") || ".";
  const content = MOCK_FILE_CONTENTS[normalized] ?? MOCK_FILE_CONTENTS[file];
  if (content) {
    return { lines: content.split("\n").map(out) };
  }
  return { lines: [err(t("cmdOutput.catNoSuchFile", { file }))] };
}

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

function runGit(parts: string[], t: Translate): CommandResult {
  const sub = parts[1]?.toLowerCase();
  if (sub === "status") {
    return {
      lines: [
        out(t("cmdOutput.gitOnBranch")),
        out(t("cmdOutput.gitUpToDate")),
        out(""),
        out(t("cmdOutput.gitChangesNotStaged")),
        out(t("cmdOutput.gitUseAdd")),
        out(
          t("cmdOutput.gitModifiedLine", {
            path: "apps/web/src/app/[locale]/blog/page.tsx",
          })
        ),
        out(
          t("cmdOutput.gitModifiedLine", {
            path: "apps/web/src/components/shared/pagination.tsx",
          })
        ),
        out(""),
        out(t("cmdOutput.gitNoChangesToCommit")),
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
          out(t("cmdOutput.gitCommitSuccess", { hash: randomHash(), msg })),
          out(
            t("cmdOutput.gitCommitStats", {
              files,
              ins,
              del,
            })
          ),
        ],
      };
    }
    return {
      lines: [
        out(t("cmdOutput.gitConventionalFormat")),
        out(`  ${t("cmdOutput.gitCommitExample")}`),
        out(t("cmdOutput.gitCommitTypes")),
      ],
    };
  }
  if (sub === "log") {
    return {
      lines: [
        out(t("cmdOutput.gitLogCommit", { hash: randomHash() })),
        out(t("cmdOutput.gitLogAuthor")),
        out(t("cmdOutput.gitLogDate")),
        out(""),
        out(t("cmdOutput.gitLogMessage")),
      ],
    };
  }
  return {
    lines: [err(t("cmdOutput.gitNotACommand", { sub: sub ?? "" }))],
  };
}

export function executeCommand(
  cmd: string,
  cwd: string,
  t: Translate
): CommandResult {
  const trimmed = cmd.trim();
  const parts = trimmed.split(RE_WHITESPACE);
  const cmdName = parts[0]?.toLowerCase() ?? "";

  switch (cmdName) {
    case "clear":
      return { lines: [] };
    case "pwd":
      return { lines: [out(cwd.replace("/workspace/portfolio", "~"))] };
    case "ls": {
      const hasLongFlag = parts.some(
        (p) => p === "-l" || p === "-a" || p === "-la" || p === "-al"
      );
      return runLs(cwd, hasLongFlag);
    }
    case "whoami":
      return { lines: [out(t("cmdOutput.whoami"))] };
    case "help":
    case "?":
      return {
        lines: [
          out(t("cmdOutput.cmdHelpAvailable")),
          out(""),
          out(t("cmdOutput.cmdHelpGitStatus")),
          out(t("cmdOutput.cmdHelpGitCommit")),
          out(""),
          out(t("cmdOutput.cmdHelpCat")),
          out(t("cmdOutput.cmdHelpEcho")),
          out(t("cmdOutput.cmdHelpClear")),
          out(t("cmdOutput.cmdHelpLs")),
          out(t("cmdOutput.cmdHelpPwd")),
          out(t("cmdOutput.cmdHelpCd")),
          out(t("cmdOutput.cmdHelpHelp")),
        ],
      };
    case "cat":
      return runCat(parts, t);
    case "echo":
      return { lines: [out(parts.slice(1).join(" "))] };
    case "cd":
      return runCd(parts, cwd);
    case "git":
      return runGit(parts, t);
    default:
      if (!trimmed) {
        return { lines: [] };
      }
      return {
        lines: [err(t("cmdOutput.commandNotFound", { cmd: parts[0] ?? cmd }))],
      };
  }
}
