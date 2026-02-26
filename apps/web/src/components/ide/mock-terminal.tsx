"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

interface TerminalLine {
  type: "input" | "output" | "error";
  content: string;
  isDir?: boolean;
}

const MOCK_CWD = "/workspace/portfolio";
const MOCK_FILES = [
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

function getTabCompletions(input: string, cwd: string): string[] {
  const trimmed = input.trimEnd();
  const parts = trimmed.split(/\s+/);
  const lastPart = parts[parts.length - 1] ?? "";
  const prefix = lastPart.toLowerCase();

  if (parts.length <= 1) {
    return COMMANDS.filter((c) => c.startsWith(prefix) || c.startsWith(lastPart));
  }

  const cmd = parts[0]?.toLowerCase();
  if (cmd === "cat") {
    const keys = Object.keys(FILE_CONTENTS);
    return keys.filter(
      (k) =>
        k.toLowerCase().startsWith(prefix) ||
        k.replace(/^src\//, "").toLowerCase().startsWith(prefix)
    );
  }
  if (cmd === "cd") {
    return MOCK_DIRS.filter(
      (d) =>
        d.toLowerCase().startsWith(prefix) || d.startsWith(lastPart)
    );
  }

  return [];
}

function applyTabCompletion(input: string, completions: string[]): string {
  if (completions.length === 0) return input;
  const trimmed = input.trimEnd();
  const parts = trimmed.split(/\s+/);
  const lastPart = parts[parts.length - 1] ?? "";
  const prefix = lastPart.toLowerCase();

  const matches = completions.filter(
    (c) => c.toLowerCase().startsWith(prefix) || c.startsWith(lastPart)
  );
  if (matches.length === 0) return input;

  if (matches.length === 1) {
    const before = parts.slice(0, -1).join(" ");
    const suffix = ["cd", "cat"].includes(parts[0]?.toLowerCase() ?? "")
      ? " "
      : "";
    return before ? `${before} ${matches[0]}${suffix}` : `${matches[0]}${suffix}`;
  }

  let commonPrefix = matches[0] ?? "";
  for (const s of matches.slice(1)) {
    let i = 0;
    const a = commonPrefix.toLowerCase();
    const b = s.toLowerCase();
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    commonPrefix = commonPrefix.slice(0, i);
  }
  const before = parts.slice(0, -1).join(" ");
  return before ? `${before} ${commonPrefix}` : commonPrefix;
}

// File contents from explorer - paths resolve: about.md -> src/about.md
// Directories (src, apps, packages) cannot be used with cat
const FILE_CONTENTS: Record<string, string[]> = {
  "tsconfig.json": [
    "{",
    '  "compilerOptions": {',
    '    "target": "ES2022",',
    '    "module": "ESNext",',
    '    "moduleResolution": "bundler",',
    '    "strict": true',
    "  }",
    "}",
  ],
  ".env": [
    "# Local env vars",
    "NODE_ENV=development",
  ],
  "package.json": [
    "{",
    '  "name": "portfolio",',
    '  "version": "0.0.0",',
    '  "private": true,',
    '  "type": "module",',
    '  "scripts": {',
    '    "dev": "turbo dev",',
    '    "build": "turbo build"',
    "  }",
    "}",
  ],
  "readme.md": [
    "# Portfolio",
    "",
    "A developer portfolio built with Next.js.",
    "",
    "## Getting started",
    "",
    "```bash",
    "bun install",
    "bun run dev",
    "```",
  ],
  "about.md": [
    "# About",
    "",
    "> A bit about me",
    "",
    "I'm a software engineer with a passion for building backend",
    "& web applications. Currently actively seeking new opportunities.",
    "",
    "---",
    "",
    "## Experience",
    "",
    "### Freelance — *2019 - Present*",
    "Freelance Developer / Open Source Contributor",
    "",
    "### Tokyo School — *2024 - Present*",
    "PCAP Python, Computer Programming",
    "",
    "### Insergal — *2018 - 2019*",
    "Sales Assistant, Marketing",
    "",
    "### Insergal — *2018 - 2019*",
    "Automotive Mechanic",
  ],
  "src/about.md": [
    "# About",
    "",
    "> A bit about me",
    "",
    "I'm a software engineer with a passion for building backend",
    "& web applications. Currently actively seeking new opportunities.",
    "",
    "---",
    "",
    "## Experience",
    "",
    "### Freelance — *2019 - Present*",
    "Freelance Developer / Open Source Contributor",
    "",
    "### Tokyo School — *2024 - Present*",
    "PCAP Python, Computer Programming",
    "",
    "### Insergal — *2018 - 2019*",
    "Sales Assistant, Marketing",
    "",
    "### Insergal — *2018 - 2019*",
    "Automotive Mechanic",
  ],
  "src/welcome.tsx": [
    "import { Separator } from \"@portfolio/ui\";",
    "import { FeaturedProjects } from \"@/components/home/featured-projects\";",
    "import { SocialNav } from \"@/components/home/social-nav\";",
    "import { getGitHubRepos } from \"@/lib/github\";",
    "",
    "export const metadata = {",
    "  title: \"Martin Vila\",",
    "  description: \"developer · gamer · self-taught\",",
    "};",
    "",
    "const socials = [",
    "  { name: \"github\", href: \"https://github.com/kWAYTV\", icon: Github },",
    "  ...",
    "];",
    "",
    "export default async function Home() {",
    "  const repos = await getGitHubRepos();",
    "  return (",
    "    <main className=\"space-y-6\">",
    "      <h1>Martin Vila</h1>",
    "      ...",
    "    </main>",
    "  );",
    "}",
  ],
  "src/projects.ts": [
    "import { Octokit } from \"@octokit/rest\";",
    "",
    "export async function getRepositories(): Promise<Repository[]> {",
    "  const { data } = await octokit.repos.listForUser({",
    "    username: \"kWAYTV\",",
    "    sort: \"updated\",",
    "    per_page: 100,",
    "  });",
    "  return data.map(({ name, description, ... }) => ({ name, description, ... }));",
    "}",
    "",
    "export const sortOptions = [\"stars\", \"updated\", \"created\", \"name\"] as const;",
  ],
  "src/blog/index.mdx": [
    "---",
    "title: Blog",
    "description: Quiet notes from current work",
    "---",
    "",
    "# Blog",
    "",
    "Quiet notes from current work. More entries will fall in here",
    "as they are published — kept chronologically, nothing fancy.",
    "",
    "## Latest Posts",
    "",
    "- **Shipping the Wrong Thing** — *Feb 23, 2026*",
    "- **The Side Project Graveyard** — *Dec 22, 2025*",
    "- **Hello World** — *Nov 29, 2025*",
  ],
};

type OutputLine =
  | { type: "output"; content: string }
  | { type: "error"; content: string }
  | { type: "ls-line"; content: string; isDir: boolean };

function resolveFilePath(_cwd: string, fileArg: string): string | null {
  const normalized = fileArg.replace(/\\/g, "/").toLowerCase();
  const keys = Object.keys(FILE_CONTENTS);
  const lowerToKey = Object.fromEntries(keys.map((k) => [k.toLowerCase(), k]));

  for (const candidate of [normalized, `src/${normalized}`]) {
    const key = lowerToKey[candidate];
    if (key) return key;
  }
  if (normalized === "readme" || normalized === "readme.md") {
    return lowerToKey["readme.md"] ?? null;
  }
  return null;
}

function executeCommand(
  cmd: string,
  cwd: string
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
      const showAll = args.includes("-la") || args.includes("-l") || args.includes("-a");
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
      if (!file) return { lines: [err("cat: missing file operand")] };
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
    return {
      lines: [
        "Available commands:",
        "  ls, ls -la    List files",
        "  pwd           Print working directory",
        "  cd <dir>      Change directory",
        "  cat <file>   Display file (package.json, tsconfig.json, README.md,",
        "               .env, about.md, src/welcome.tsx, src/projects.ts, etc.)",
        "  echo <text>   Echo text",
        "  clear         Clear terminal",
        "  whoami        Current user",
        "  date          Current date/time",
        "  help, ?       Show this help",
        "",
        "Easter eggs: pnpm run dev, git status",
      ].map(out),
    };
  }

  if (!trimmed) return { lines: [] };

  return {
    lines: [err(`${command}: command not found`)],
  };
}

function Prompt({ path }: { path: string }) {
  return (
    <span className="terminal-prompt">
      <span style={{ color: "var(--terminal-user)" }}>visitor</span>
      <span className="text-muted-foreground">@</span>
      <span style={{ color: "var(--terminal-host)" }}>portfolio</span>
      <span className="text-muted-foreground"> </span>
      <span style={{ color: "var(--terminal-path)" }}>{path}</span>
      <span style={{ color: "var(--terminal-user)" }}> %</span>
    </span>
  );
}

export function MockTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>(() => [
    {
      type: "output",
      content: "Welcome to the portfolio terminal. Type 'help' for available commands.",
    },
    { type: "input", content: "" },
  ]);
  const [cwd, setCwd] = useState(MOCK_CWD);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pathDisplay = cwd.replace("/workspace/portfolio", "~");
  const prompt = `visitor@portfolio ${pathDisplay} %`;

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [lines]);

  const execute = useCallback(() => {
    if (!inputValue.trim()) return;

    const cmd = inputValue.trim();
    const fullLine = `${prompt} ${inputValue}`;
    const { lines: outputLines, newCwd } = executeCommand(inputValue, cwd);

    if (cmd.toLowerCase() !== "clear") {
      setHistory((prev) => {
        const next = [...prev];
        if (next[next.length - 1] !== cmd) next.push(cmd);
        return next.slice(-50);
      });
    }
    setHistoryIndex(-1);

    if (cmd.toLowerCase() === "clear") {
      setLines([
        {
          type: "output",
          content: "Welcome to the portfolio terminal. Type 'help' for available commands.",
        },
        { type: "input", content: "" },
      ]);
    } else {
      setLines((prev) => {
        const withoutLastInput = prev.slice(0, -1);
        const newLines: TerminalLine[] = [
          ...withoutLastInput,
          { type: "input", content: fullLine },
          ...outputLines.map((line) => {
            if (line.type === "ls-line") {
              return { type: "output" as const, content: line.content, isDir: line.isDir };
            }
            return { type: line.type, content: line.content };
          }) as (TerminalLine & { isDir?: boolean })[],
          { type: "input", content: "" },
        ];
        return newLines;
      });
    }

    if (newCwd) setCwd(newCwd);
    setInputValue("");
  }, [inputValue, cwd, prompt]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        execute();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length === 0) return;
        const nextIndex = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputValue(history[nextIndex] ?? "");
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < 0) return;
        const nextIndex = historyIndex + 1;
        if (nextIndex >= history.length) {
          setHistoryIndex(-1);
          setInputValue("");
        } else {
          setHistoryIndex(nextIndex);
          setInputValue(history[nextIndex] ?? "");
        }
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const completions = getTabCompletions(inputValue, cwd);
        if (completions.length > 0) {
          setInputValue(applyTabCompletion(inputValue, completions));
        }
        return;
      }
      if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        setLines((prev) => [...prev.slice(0, -1), { type: "input", content: "" }]);
        setInputValue("");
      }
    },
    [execute, history, historyIndex, inputValue, cwd]
  );

  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="terminal-root flex h-full min-h-0 flex-col font-mono text-[13px]"
      onClick={handleTerminalClick}
      onKeyDown={() => inputRef.current?.focus()}
      role="button"
      tabIndex={0}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-3"
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all">
            {line.type === "input" && line.content === "" ? (
              <span className="flex items-center gap-1">
                <Prompt path={pathDisplay} />
                <input
                  ref={i === lines.length - 1 ? inputRef : undefined}
                  className="terminal-input min-w-[1ch] flex-1 bg-transparent outline-none"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  aria-label="Terminal input"
                />
              </span>
            ) : line.type === "input" ? (
              <span className="terminal-history-line">
                <Prompt path={pathDisplay} />
                <span className="text-foreground">
                  {" "}
                  {line.content.includes(" % ") ? line.content.split(" % ")[1] ?? "" : line.content}
                </span>
              </span>
            ) : line.type === "error" ? (
              <span style={{ color: "var(--terminal-error)" }}>{line.content}</span>
            ) : "isDir" in line && line.isDir ? (
              <span style={{ color: "var(--terminal-host)" }}>{line.content}</span>
            ) : (
              <span style={{ color: "var(--terminal-output)" }}>{line.content}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
