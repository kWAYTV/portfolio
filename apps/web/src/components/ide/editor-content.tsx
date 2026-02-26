"use client";

import { cn } from "@portfolio/ui";
import { Code2, Eye } from "lucide-react";
import { useState } from "react";

interface EditorContentProps {
  preview: React.ReactNode;
  source: React.ReactNode;
}

export function EditorContent({ preview, source }: EditorContentProps) {
  const [view, setView] = useState<"code" | "preview">("preview");

  return (
    <>
      <div className="flex shrink-0 items-center justify-center border-[var(--ide-border)] border-b bg-[var(--ide-editor)] px-3 py-1.5">
        <div className="flex items-center rounded-lg border border-[var(--ide-border)] bg-[var(--ide-tab-bar)] p-0.5 text-xs">
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all",
              view === "preview"
                ? "bg-[var(--ide-tab-active)] text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setView("preview")}
            type="button"
          >
            <Eye className="size-3.5" />
            Preview
          </button>
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all",
              view === "code"
                ? "bg-[var(--ide-tab-active)] text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setView("code")}
            type="button"
          >
            <Code2 className="size-3.5" />
            Code
          </button>
        </div>
      </div>
      {view === "code" ? source : preview}
    </>
  );
}
