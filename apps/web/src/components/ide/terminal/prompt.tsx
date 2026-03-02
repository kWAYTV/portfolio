"use client";

import { useTranslations } from "next-intl";

export function TerminalPrompt({ path }: { path: string }) {
  const t = useTranslations("terminal");
  return (
    <span className="terminal-prompt">
      <span style={{ color: "var(--terminal-user)" }}>
        {t("cmdOutput.promptUser")}
      </span>
      <span className="text-muted-foreground">@</span>
      <span style={{ color: "var(--terminal-host)" }}>
        {t("cmdOutput.promptHost")}
      </span>
      <span className="text-muted-foreground"> </span>
      <span style={{ color: "var(--terminal-path)" }}>{path}</span>
      <span style={{ color: "var(--terminal-user)" }}> %</span>
    </span>
  );
}
