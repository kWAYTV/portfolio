"use client";

import { analytics } from "@repo/analytics";
import { Terminal } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useIdeStore } from "@/modules/ide/stores/ide-store";

export function StatusBarTerminalButton() {
  const t = useTranslations("ide");
  const terminalOpen = useIdeStore((s) => s.terminalOpen);
  const toggleTerminal = useIdeStore((s) => s.toggleTerminal);

  return (
    <button
      aria-label={t("terminal")}
      className={cn(
        "flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground",
        terminalOpen && "text-foreground"
      )}
      onClick={() => {
        analytics.terminalToggle(!terminalOpen);
        toggleTerminal();
      }}
      type="button"
    >
      <Terminal className="size-3.5 shrink-0" />
      <span className="hidden sm:inline">{t("terminal")}</span>
    </button>
  );
}
