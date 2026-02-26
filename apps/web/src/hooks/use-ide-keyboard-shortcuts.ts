"use client";

import { type RefObject, useEffect } from "react";

interface UseIdeKeyboardShortcutsOptions {
  contentRef: RefObject<HTMLDivElement | null>;
  onToggleSidebar: () => void;
  onToggleTerminal: () => void;
}

export function useIdeKeyboardShortcuts({
  contentRef,
  onToggleSidebar,
  onToggleTerminal,
}: UseIdeKeyboardShortcutsOptions) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        const el = contentRef.current;
        if (!el) {
          return;
        }
        const range = document.createRange();
        range.selectNodeContents(el);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        onToggleSidebar();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "j") {
        e.preventDefault();
        onToggleTerminal();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [contentRef, onToggleSidebar, onToggleTerminal]);
}
