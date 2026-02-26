"use client";

import { cn, Tooltip, TooltipContent, TooltipTrigger } from "@portfolio/ui";
import { GripHorizontal, PanelBottomClose, Play, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { MockTerminal } from "./mock-terminal";

const MIN_HEIGHT = 120;
const MAX_HEIGHT = 600;
const DEFAULT_HEIGHT = 200;

interface TerminalPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TerminalPanel({ onClose, isOpen }: TerminalPanelProps) {
  const t = useTranslations("ide");
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringResize, setIsHoveringResize] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const panel = panelRef.current;
      if (!panel) {
        return;
      }
      const rect = panel.getBoundingClientRect();
      const newHeight = rect.bottom - e.clientY;
      setHeight(Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, newHeight)));
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  if (!isOpen) {
    return null;
  }

  const showResizeHandle = isHoveringResize || isDragging;

  return (
    <div
      className="flex shrink-0 select-none flex-col bg-background"
      ref={panelRef}
      style={{ height: `${height}px`, minHeight: MIN_HEIGHT }}
    >
      <div
        aria-label={t("resizeTerminal")}
        className={cn(
          "-my-2 z-10 flex min-h-[8px] items-center justify-center py-0.5 transition-colors duration-150",
          showResizeHandle
            ? "cursor-ns-resize border-border border-y bg-muted/60"
            : "cursor-default border-transparent bg-transparent",
          isDragging && "bg-muted/80"
        )}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHoveringResize(true)}
        onMouseLeave={() => setIsHoveringResize(false)}
        role="separator"
      >
        <GripHorizontal
          className={cn(
            "size-3.5 text-muted-foreground transition-opacity duration-150",
            showResizeHandle ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
      <div className="flex h-8 shrink-0 items-center justify-between border-border border-b bg-background px-2">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 text-muted-foreground" />
          <span className="font-medium text-[11px] text-foreground">
            {t("terminal")}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="flex size-6 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => {
                  const w = window.open(
                    typeof window !== "undefined" ? window.location.href : "/",
                    "_blank",
                    "noopener,noreferrer,width=1200,height=800"
                  );
                  w?.focus();
                }}
                type="button"
              >
                <Play className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">{t("openPreview")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="flex size-6 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={onClose}
                type="button"
              >
                <PanelBottomClose className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">{t("closePanel")}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="terminal-viewport min-h-0 flex-1 overflow-hidden bg-background">
        <MockTerminal />
      </div>
    </div>
  );
}
