"use client";

import type { KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  applyTabCompletion,
  executeCommand,
  getGhostSuggestion,
  getTabCompletions,
  MOCK_CWD,
} from "@/components/ide/terminal/commands";

export interface TerminalLine {
  content: string;
  isDir?: boolean;
  type: "input" | "output" | "error";
}

export function useTerminalState() {
  const t = useTranslations("terminal");
  const [lines, setLines] = useState<TerminalLine[]>(() => [
    { type: "output", content: t("welcome") },
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
    if (!inputValue.trim()) {
      return;
    }

    const cmd = inputValue.trim();
    const fullLine = `${prompt} ${inputValue}`;
    const tHelp = {
      helpIntro: t("helpIntro"),
      helpLs: t("helpLs"),
      helpPwd: t("helpPwd"),
      helpCd: t("helpCd"),
      helpCat: t("helpCat"),
      helpCat2: t("helpCat2"),
      helpEcho: t("helpEcho"),
      helpClear: t("helpClear"),
      helpWhoami: t("helpWhoami"),
      helpDate: t("helpDate"),
      helpHelp: t("helpHelp"),
      helpEasterEggs: t("helpEasterEggs"),
    };
    const { lines: outputLines, newCwd } = executeCommand(
      inputValue,
      cwd,
      tHelp
    );

    if (cmd.toLowerCase() !== "clear") {
      setHistory((prev) => {
        const next = [...prev];
        if (next[next.length - 1] !== cmd) {
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
      setLines((prev) => {
        const withoutLastInput = prev.slice(0, -1);
        const newLines: TerminalLine[] = [
          ...withoutLastInput,
          { type: "input", content: fullLine },
          ...(outputLines.map((line) => {
            if (line.type === "ls-line") {
              return {
                type: "output" as const,
                content: line.content,
                isDir: line.isDir,
              };
            }
            return { type: line.type, content: line.content };
          }) as (TerminalLine & { isDir?: boolean })[]),
          { type: "input", content: "" },
        ];
        return newLines;
      });
    }

    if (newCwd) {
      setCwd(newCwd);
    }
    setInputValue("");
  }, [inputValue, cwd, prompt, t]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        execute();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length === 0) {
          return;
        }
        const nextIndex =
          historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputValue(history[nextIndex] ?? "");
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
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
        setLines((prev) => [
          ...prev.slice(0, -1),
          { type: "input", content: "" },
        ]);
        setInputValue("");
      }
    },
    [execute, history, historyIndex, inputValue, cwd]
  );

  return {
    cwd,
    handleKeyDown,
    inputRef,
    inputValue,
    lines,
    pathDisplay,
    scrollRef,
    setInputValue,
  };
}
