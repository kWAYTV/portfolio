"use client";

import { useCallback } from "react";
import { TerminalLine } from "@/components/ide/terminal/terminal-line";
import { useTerminalState } from "@/hooks/use-terminal-state";

export function MockTerminal() {
  const {
    cwd,
    handleKeyDown,
    inputRef,
    inputValue,
    lines,
    pathDisplay,
    scrollRef,
    setInputValue,
  } = useTerminalState();

  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <div
      className="terminal-root flex h-full min-h-0 flex-col font-mono text-[13px]"
      onClick={handleTerminalClick}
      onKeyDown={() => inputRef.current?.focus()}
      role="button"
      tabIndex={0}
    >
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden p-3"
        ref={scrollRef}
      >
        {lines.map((line, i) => (
          <div className="whitespace-pre-wrap break-all" key={i}>
            <TerminalLine
              cwd={cwd}
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
    </div>
  );
}
