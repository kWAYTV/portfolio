"use client";

import { cn } from "@portfolio/ui";
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

type OutputLine = { type: "output" | "error"; content: string };

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
        return {
          lines: [
            "total 42",
            "drwxr-xr-x  12 user  staff  384 Feb 26 10:00 .",
            "drwxr-xr-x   3 user  staff   96 Feb 26 09:00 ..",
            "-rw-r--r--   1 user  staff  512 Feb 26 10:00 package.json",
            "-rw-r--r--   1 user  staff  256 Feb 26 10:00 tsconfig.json",
            "-rw-r--r--   1 user  staff 1024 Feb 26 10:00 README.md",
            "-rw-r--r--   1 user  staff   64 Feb 26 10:00 .env",
            "drwxr-xr-x   5 user  staff  160 Feb 26 10:00 src",
            "drwxr-xr-x   6 user  staff  192 Feb 26 10:00 apps",
            "drwxr-xr-x   7 user  staff  224 Feb 26 10:00 packages",
          ].map(out),
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
      if (file === "package.json") {
        return {
          lines: [
            '{',
            '  "name": "portfolio",',
            '  "version": "0.0.0",',
            '  "private": true,',
            '  "type": "module",',
            '  "scripts": {',
            '    "dev": "turbo dev",',
            '    "build": "turbo build"',
            "  }",
            "}",
          ].map(out),
        };
      }
      if (file === "README.md") {
        return {
          lines: [
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
          ].map(out),
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

  if (command === "npm" && args[0] === "run" && args[1] === "dev") {
    return {
      lines: [
        "> portfolio@0.0.0 dev",
        "> turbo dev",
        "",
        "• Packages in scope: web",
        "• Running dev in 1 packages",
        "• Remote caching disabled",
        "",
        "web:ready - started server on 0.0.0.0:3000",
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
        "  cat <file>   Display file contents",
        "  echo <text>   Echo text",
        "  clear         Clear terminal",
        "  whoami        Current user",
        "  date          Current date/time",
        "  help, ?       Show this help",
        "",
        "Easter eggs: npm run dev, git status",
      ].map(out),
    };
  }

  if (!trimmed) return { lines: [] };

  return {
    lines: [err(`${command}: command not found`)],
  };
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const prompt = `visitor@portfolio ${cwd.replace("/workspace/portfolio", "~")} %`;

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  const execute = useCallback(() => {
    if (!inputValue.trim()) return;

    const fullLine = `${prompt} ${inputValue}`;
    const { lines: outputLines, newCwd } = executeCommand(inputValue, cwd);

    if (inputValue.trim().toLowerCase() === "clear") {
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
          ...outputLines.map((line) => ({
            type: line.type,
            content: line.content,
          })),
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
      }
      if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        setLines((prev) => [...prev.slice(0, -1), { type: "input", content: "" }]);
        setInputValue("");
      }
    },
    [execute]
  );

  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="flex h-full min-h-0 flex-col font-mono text-[13px]"
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
          <div
            key={i}
            className={cn(
              "whitespace-pre-wrap break-all",
              line.type === "error" && "text-destructive"
            )}
          >
            {line.type === "input" && line.content === "" ? (
              <span className="flex items-center gap-1">
                <span className="text-muted-foreground">{prompt}</span>
                <input
                  ref={i === lines.length - 1 ? inputRef : undefined}
                  className="min-w-[1ch] flex-1 bg-transparent outline-none"
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
              <span className="text-foreground">{line.content}</span>
            ) : (
              <span className="text-muted-foreground">{line.content}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
