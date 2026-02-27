"use client";

import { useCallback, useRef, useState } from "react";

const WELCOME = "Welcome. Type 'help' for available commands.";
const PROMPT = "visitor@portfolio ~ %";

export function MockTerminal() {
  const [lines, setLines] = useState<
    { type: "input" | "output"; content: string }[]
  >([
    { type: "output", content: WELCOME },
    { type: "input", content: "" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const execute = useCallback(() => {
    if (!inputValue.trim()) {
      return;
    }
    const cmd = inputValue.trim().toLowerCase();
    const fullLine = `${PROMPT} ${inputValue}`;

    let output: string[] = [];
    if (cmd === "clear") {
      setLines([
        { type: "output", content: WELCOME },
        { type: "input", content: "" },
      ]);
    } else if (cmd === "help" || cmd === "?") {
      output = [
        "Available commands:",
        "  ls, ls -la    List files",
        "  pwd           Print working directory",
        "  cd <dir>      Change directory",
        "  cat <file>    Display file",
        "  echo <text>   Echo text",
        "  clear         Clear terminal",
        "  help, ?       Show this help",
      ];
    } else if (cmd === "pwd") {
      output = ["~"];
    } else if (cmd === "ls" || cmd.startsWith("ls ")) {
      output = ["package.json  tsconfig.json  README.md  src  apps  packages"];
    } else if (cmd === "whoami") {
      output = ["visitor"];
    } else {
      output = [`${cmd.split(" ")[0]}: command not found`];
    }

    if (cmd !== "clear") {
      setLines((prev) => [
        ...prev.slice(0, -1),
        { type: "input", content: fullLine },
        ...output.map((c) => ({ type: "output" as const, content: c })),
        { type: "input", content: "" },
      ]);
    }
    setInputValue("");
  }, [inputValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        execute();
      }
    },
    [execute]
  );

  function renderLine(
    line: { type: "input" | "output"; content: string },
    i: number
  ) {
    const isActiveInput =
      line.type === "input" && line.content === "" && i === lines.length - 1;
    if (isActiveInput) {
      return (
        <span className="flex items-center gap-1">
          <span className="text-muted-foreground">{PROMPT}</span>
          <input
            aria-label="Terminal input"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="terminal-input min-w-[1ch] flex-1 bg-transparent outline-none"
            id="terminal-input"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            spellCheck={false}
            value={inputValue}
          />
        </span>
      );
    }
    if (line.type === "input") {
      return (
        <span>
          <span className="text-muted-foreground">{PROMPT}</span>
          <span className="text-foreground">
            {" "}
            {line.content.split(" % ")[1] ?? line.content}
          </span>
        </span>
      );
    }
    return <span>{line.content}</span>;
  }

  return (
    <label
      className="terminal-root flex h-full min-h-0 cursor-text flex-col font-mono text-[13px]"
      htmlFor="terminal-input"
    >
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden p-3"
        ref={scrollRef}
      >
        {lines.map((line, i) => {
          const key = `${i}-${line.type}-${line.content.slice(0, 30)}`;
          return (
            <div className="whitespace-pre-wrap break-all" key={key}>
              {renderLine(line, i)}
            </div>
          );
        })}
      </div>
    </label>
  );
}
