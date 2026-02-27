"use client";

import { useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { executeCommand } from "@/components/ide/terminal/command-handlers";
import {
  applyTabCompletion,
  getTabCompletions,
} from "@/components/ide/terminal/commands";

const MOCK_CWD = "/workspace/portfolio";

export interface TerminalLine {
  content: string;
  type: "input" | "output" | "error";
}

export function useTerminalState() {
  const t = useTranslations("terminal");
  const [lines, setLines] = useState<TerminalLine[]>(() => [
    { type: "output", content: t("welcome") },
    { type: "input", content: "" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cwd, setCwd] = useState(MOCK_CWD);
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when lines change
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, lines]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refocus when lines change
  useEffect(() => {
    inputRef.current?.focus();
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [lines]);

  const execute = useCallback(() => {
    if (!inputValue.trim()) {
      return;
    }

    const cmd = inputValue.trim();
    const fullLine = `${prompt} ${inputValue}`;
    const result = executeCommand(cmd, cwd);

    if (result.cwd !== undefined) {
      setCwd(result.cwd);
    }
    if (cmd.toLowerCase() !== "clear") {
      setHistory((prev) => {
        const next = [...prev];
        if (next.at(-1) !== cmd) {
          next.push(cmd);
        }
        return next.slice(-50);
      });
    }
    setHistoryIndex(-1);

    if (cmd.toLowerCase() === "clear") {
      setLines([
        { type: "output", content: t("welcome") },
        { type: "input", content: "" },
      ]);
    } else {
      setLines((prev) => [
        ...prev.slice(0, -1),
        { type: "input", content: fullLine },
        ...result.lines,
        { type: "input", content: "" },
      ]);
    }
    setInputValue("");
  }, [inputValue, prompt, cwd, t]);

  const handleArrowUp = useCallback(() => {
    if (history.length === 0) {
      return;
    }
    const nextIndex =
      historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
    setHistoryIndex(nextIndex);
    setInputValue(history[nextIndex] ?? "");
  }, [history, historyIndex]);

  const handleArrowDown = useCallback(() => {
    if (historyIndex < 0) {
      return;
    }
    const nextIndex = historyIndex + 1;
    if (nextIndex >= history.length) {
      setHistoryIndex(-1);
      setInputValue("");
    } else {
      setHistoryIndex(nextIndex);
      setInputValue(history[nextIndex] ?? "");
    }
  }, [history, historyIndex]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        execute();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        handleArrowUp();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        handleArrowDown();
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const completions = getTabCompletions(inputValue);
        if (completions.length > 0) {
          setInputValue(applyTabCompletion(inputValue, completions));
        }
        return;
      }
      if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        setLines((prev) => [
          ...prev.slice(0, -1),
          { type: "input", content: "" },
        ]);
        setInputValue("");
      }
    },
    [execute, handleArrowUp, handleArrowDown, inputValue]
  );

  return {
    handleKeyDown,
    inputRef,
    inputValue,
    lines,
    pathDisplay,
    scrollRef,
    setInputValue,
  };
}
