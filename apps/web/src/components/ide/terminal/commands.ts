import { FILE_CONTENTS } from "./file-contents";

export const MOCK_CWD = "/workspace/portfolio";
export const MOCK_FILES = [
  "package.json",
  "tsconfig.json",
  "README.md",
  ".env",
  "src",
  "apps",
  "packages",
];

const MOCK_DIRS = ["src", "apps", "packages", ".", "..", "~"];
const COMMANDS = [
  "clear",
  "pwd",
  "ls",
  "cd",
  "cat",
  "echo",
  "whoami",
  "date",
  "help",
  "?",
  "npm",
  "pnpm",
  "git",
];

export type OutputLine =
  | { type: "output"; content: string }
  | { type: "error"; content: string }
  | { type: "ls-line"; content: string; isDir: boolean };

export type TerminalTranslations = {
  helpIntro: string;
  helpLs: string;
  helpPwd: string;
  helpCd: string;
  helpCat: string;
  helpCat2: string;
  helpEcho: string;
  helpClear: string;
  helpWhoami: string;
  helpDate: string;
  helpHelp: string;
  helpEasterEggs: string;
};

export function getTabCompletions(input: string, _cwd: string): string[] {
  const trimmed = input.trimEnd();
  const parts = trimmed.split(/\s+/);
  const lastPart = parts[parts.length - 1] ?? "";
  const prefix = lastPart.toLowerCase();

  if (parts.length <= 1) {
    return COMMANDS.filter(
      (c) => c.startsWith(prefix) || c.startsWith(lastPart)
    );
  }

  const cmd = parts[0]?.toLowerCase();
  if (cmd === "cat") {
    const keys = Object.keys(FILE_CONTENTS);
    return keys.filter(
      (k) =>
        k.toLowerCase().startsWith(prefix) ||
        k
          .replace(/^src\//, "")
          .toLowerCase()
          .startsWith(prefix)
    );
  }
  if (cmd === "cd") {
    return MOCK_DIRS.filter(
      (d) => d.toLowerCase().startsWith(prefix) || d.startsWith(lastPart)
    );
  }

  return [];
}

export function applyTabCompletion(
  input: string,
  completions: string[]
): string {
  if (completions.length === 0) {
    return input;
  }
  const trimmed = input.trimEnd();
  const parts = trimmed.split(/\s+/);
  const lastPart = parts[parts.length - 1] ?? "";
  const prefix = lastPart.toLowerCase();

  const matches = completions.filter(
    (c) => c.toLowerCase().startsWith(prefix) || c.startsWith(lastPart)
  );
  if (matches.length === 0) {
    return input;
  }

  if (matches.length === 1) {
    const before = parts.slice(0, -1).join(" ");
    const suffix = ["cd", "cat"].includes(parts[0]?.toLowerCase() ?? "")
      ? " "
      : "";
    return before
      ? `${before} ${matches[0]}${suffix}`
      : `${matches[0]}${suffix}`;
  }

  let commonPrefix = matches[0] ?? "";
  for (const s of matches.slice(1)) {
    let i = 0;
    const a = commonPrefix.toLowerCase();
    const b = s.toLowerCase();
    while (i < a.length && i < b.length && a[i] === b[i]) {
      i++;
    }
    commonPrefix = commonPrefix.slice(0, i);
  }
  const before = parts.slice(0, -1).join(" ");
  return before ? `${before} ${commonPrefix}` : commonPrefix;
}

export function getGhostSuggestion(input: string, cwd: string): string | null {
  const completions = getTabCompletions(input, cwd);
  if (completions.length === 0) {
    return null;
  }

  const fullCompletion = applyTabCompletion(input, completions);
  const trimmed = input.trimEnd();
  if (fullCompletion === trimmed) {
    return null;
  }

  const parts = trimmed.split(/\s+/);
  const lastPart = parts[parts.length - 1] ?? "";
  const prefix = lastPart.toLowerCase();

  const matches = completions.filter(
    (c) => c.toLowerCase().startsWith(prefix) || c.startsWith(lastPart)
  );
  if (matches.length === 0) {
    return null;
  }

  if (matches.length === 1) {
    const completed = matches[0];
    const suffix = ["cd", "cat"].includes(parts[0]?.toLowerCase() ?? "")
      ? " "
      : "";
    return completed.slice(lastPart.length) + suffix;
  }

  let commonPrefix = matches[0] ?? "";
  for (const s of matches.slice(1)) {
    let i = 0;
    const a = commonPrefix.toLowerCase();
    const b = s.toLowerCase();
    while (i < a.length && i < b.length && a[i] === b[i]) {
      i++;
    }
    commonPrefix = commonPrefix.slice(0, i);
  }
  const added = commonPrefix.slice(lastPart.length);
  return added || null;
}

function resolveFilePath(_cwd: string, fileArg: string): string | null {
  const normalized = fileArg.replace(/\\/g, "/").toLowerCase();
  const keys = Object.keys(FILE_CONTENTS);
  const lowerToKey = Object.fromEntries(keys.map((k) => [k.toLowerCase(), k]));

  for (const candidate of [normalized, `src/${normalized}`]) {
    const key = lowerToKey[candidate];
    if (key) {
      return key;
    }
  }
  if (normalized === "readme" || normalized === "readme.md") {
    return lowerToKey["readme.md"] ?? null;
  }
  return null;
}

const DEFAULT_HELP: TerminalTranslations = {
  helpIntro: "Available commands:",
  helpLs: "  ls, ls -la    List files",
  helpPwd: "  pwd           Print working directory",
  helpCd: "  cd <dir>      Change directory",
  helpCat:
    "  cat <file>   Display file (package.json, tsconfig.json, README.md,",
  helpCat2:
    "               .env, about.md, src/welcome.tsx, src/projects.ts, etc.)",
  helpEcho: "  echo <text>   Echo text",
  helpClear: "  clear         Clear terminal",
  helpWhoami: "  whoami        Current user",
  helpDate: "  date          Current date/time",
  helpHelp: "  help, ?       Show this help",
  helpEasterEggs: "Easter eggs: pnpm run dev, git status",
};

export function executeCommand(
  cmd: string,
  cwd: string,
  tHelp?: TerminalTranslations
): { lines: OutputLine[]; newCwd?: string } {
  const trimmed = cmd.trim();
  const parts = trimmed.split(/\s+/);
  const [command, ...args] = parts;

  const out = (s: string): OutputLine => ({ type: "output", content: s });
  const err = (s: string): OutputLine => ({ type: "error", content: s });

  switch (command?.toLowerCase()) {
    case "clear":
      return { lines: [] };

    case "pwd":
      return { lines: [out(cwd)] };

    case "ls": {
      const showAll =
        args.includes("-la") || args.includes("-l") || args.includes("-a");
      if (showAll) {
        const lsLines: [string, boolean][] = [
          ["total 42", false],
          ["drwxr-xr-x  12 user  staff  384 Feb 26 10:00 .", true],
          ["drwxr-xr-x   3 user  staff   96 Feb 26 09:00 ..", true],
          ["-rw-r--r--   1 user  staff  512 Feb 26 10:00 package.json", false],
          ["-rw-r--r--   1 user  staff  256 Feb 26 10:00 tsconfig.json", false],
          ["-rw-r--r--   1 user  staff 1024 Feb 26 10:00 README.md", false],
          ["-rw-r--r--   1 user  staff   64 Feb 26 10:00 .env", false],
          ["drwxr-xr-x   5 user  staff  160 Feb 26 10:00 src", true],
          ["drwxr-xr-x   6 user  staff  192 Feb 26 10:00 apps", true],
          ["drwxr-xr-x   7 user  staff  224 Feb 26 10:00 packages", true],
        ];
        return {
          lines: lsLines.map(([content, isDir]) => ({
            type: "ls-line" as const,
            content,
            isDir,
          })),
        };
      }
      return { lines: [out(MOCK_FILES.join("  "))] };
    }

    case "cd": {
      const target = args[0] || "~";
      if (target === "~" || target === "") {
        return { lines: [], newCwd: "/workspace/portfolio" };
      }
      if (target === "..") {
        const parent = cwd.split("/").slice(0, -1).join("/") || "/";
        return { lines: [], newCwd: parent };
      }
      if (target.startsWith("/")) {
        return { lines: [], newCwd: target };
      }
      return { lines: [], newCwd: `${cwd}/${target}` };
    }

    case "cat": {
      const file = args[0];
      if (!file) {
        return { lines: [err("cat: missing file operand")] };
      }
      const dirs = ["src", "apps", "packages"];
      if (dirs.includes(file)) {
        return { lines: [err(`cat: ${file}: Is a directory`)] };
      }
      const resolved = resolveFilePath(cwd, file);
      if (resolved && FILE_CONTENTS[resolved]) {
        return {
          lines: FILE_CONTENTS[resolved].map((line) => out(line)),
        };
      }
      return { lines: [err(`cat: ${file}: No such file or directory`)] };
    }

    case "echo":
      return { lines: [out(args.join(" "))] };

    case "whoami":
      return { lines: [out("visitor")] };

    case "date":
      return {
        lines: [
          out(
            new Date().toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          ),
        ],
      };
  }

  if (
    (command === "pnpm" || command === "npm") &&
    args[0] === "run" &&
    args[1] === "dev"
  ) {
    return {
      lines: [
        "> portfolio@0.0.0 dev",
        "> next dev",
        "",
        "  ▲ Next.js 16.x",
        "  - Local:        http://localhost:3000",
        "",
        "✓ Ready in 1.2s",
      ].map(out),
    };
  }

  if (command === "git" && args[0] === "status") {
    return {
      lines: [
        "On branch main",
        "Your branch is up to date with 'origin/main'.",
        "",
        "nothing to commit, working tree clean",
      ].map(out),
    };
  }

  if (command === "help" || command === "?") {
    const h = tHelp ?? DEFAULT_HELP;
    return {
      lines: [
        h.helpIntro,
        h.helpLs,
        h.helpPwd,
        h.helpCd,
        h.helpCat,
        h.helpCat2,
        h.helpEcho,
        h.helpClear,
        h.helpWhoami,
        h.helpDate,
        h.helpHelp,
        "",
        h.helpEasterEggs,
      ].map(out),
    };
  }

  if (!trimmed) {
    return { lines: [] };
  }

  return {
    lines: [err(`${command}: command not found`)],
  };
}
