"use client";

import { getGhostSuggestion } from "@/components/ide/terminal/commands";
import { TerminalPrompt } from "@/components/ide/terminal/prompt";
import type { TerminalLine as TerminalLineData } from "@/hooks/use-terminal-state";

interface TerminalLineProps {
  inputId?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  inputValue: string;
  isActiveInput: boolean;
  line: TerminalLineData;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  pathDisplay: string;
}

export function TerminalLine({
  inputId,
  inputRef,
  inputValue,
  isActiveInput,
  line,
  onInputChange,
  onKeyDown,
  pathDisplay,
}: TerminalLineProps) {
  if (line.type === "input" && line.content === "" && isActiveInput) {
    const ghost = getGhostSuggestion(inputValue);
    return (
      <span className="flex min-w-0 flex-1 items-center gap-1">
        <TerminalPrompt path={pathDisplay} />
        <span className="relative flex min-w-0 flex-1">
          <input
            aria-label="Terminal input"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="terminal-input min-w-[1ch] flex-1 bg-transparent outline-none"
            id={inputId}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            ref={inputRef ?? undefined}
            spellCheck={false}
            value={inputValue}
          />
          {ghost ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center overflow-hidden pl-[2px]"
              style={{ font: "inherit" }}
            >
              <span className="invisible shrink-0 overflow-hidden whitespace-pre">
                {inputValue}
              </span>
              <span
                className="shrink-0 whitespace-pre opacity-50"
                style={{ color: "var(--terminal-output)" }}
              >
                {ghost}
              </span>
            </span>
          ) : null}
        </span>
      </span>
    );
  }

  if (line.type === "input") {
    return (
      <span className="terminal-history-line">
        <TerminalPrompt path={pathDisplay} />
        <span className="text-foreground">
          {" "}
          {line.content.includes(" % ")
            ? (line.content.split(" % ")[1] ?? "")
            : line.content}
        </span>
      </span>
    );
  }

  if (line.type === "error") {
    return (
      <span style={{ color: "var(--terminal-error)" }}>{line.content}</span>
    );
  }

  return (
    <span style={{ color: "var(--terminal-output)" }}>{line.content}</span>
  );
}
