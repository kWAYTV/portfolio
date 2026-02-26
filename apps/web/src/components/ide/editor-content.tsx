"use client";

import { cn } from "@portfolio/ui";
import { Code2, Eye } from "lucide-react";
import { useState } from "react";

interface EditorContentProps {
  preview: React.ReactNode;
  source: React.ReactNode;
}

export function EditorContent({ preview, source }: EditorContentProps) {
  const [view, setView] = useState<"code" | "preview">("code");

  return (
    <>
      <div className="flex shrink-0 items-center justify-end border-[var(--ide-border)] border-b bg-[var(--ide-editor)] px-3 py-1">
        <div className="flex items-center rounded-md bg-[var(--ide-tab-bar)] p-0.5 text-[11px]">
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-sm px-2.5 py-1 transition-colors",
              view === "code"
                ? "bg-[var(--ide-tab-active)] text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setView("code")}
            type="button"
          >
            <Code2 className="size-3" />
            Code
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-sm px-2.5 py-1 transition-colors",
              view === "preview"
                ? "bg-[var(--ide-tab-active)] text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setView("preview")}
            type="button"
          >
            <Eye className="size-3" />
            Preview
          </button>
        </div>
      </div>
      {view === "code" ? source : preview}
    </>
  );
}
