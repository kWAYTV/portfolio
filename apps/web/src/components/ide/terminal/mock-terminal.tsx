"use client";

import { useTerminalState } from "@/hooks/use-terminal-state";
import { TerminalLine } from "./terminal-line";

const TERMINAL_INPUT_ID = "terminal-input";

export function MockTerminal() {
  const {
    handleKeyDown,
    inputRef,
    inputValue,
    lines,
    pathDisplay,
    scrollRef,
    setInputValue,
  } = useTerminalState();

  return (
    <label
      className="terminal-root flex h-full min-h-0 cursor-text flex-col font-mono text-[13px]"
      htmlFor={TERMINAL_INPUT_ID}
    >
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden p-3"
        ref={scrollRef}
      >
        {lines.map((line, i) => (
          <div
            className="whitespace-pre-wrap break-all"
            key={`${i}-${line.type}-${line.content.slice(0, 20)}`}
          >
            <TerminalLine
              inputId={i === lines.length - 1 ? TERMINAL_INPUT_ID : undefined}
              inputRef={i === lines.length - 1 ? inputRef : undefined}
              inputValue={inputValue}
              isActiveInput={line.type === "input" && line.content === ""}
              line={line}
              onInputChange={setInputValue}
              onKeyDown={handleKeyDown}
              pathDisplay={pathDisplay}
            />
          </div>
        ))}
      </div>
    </label>
  );
}
