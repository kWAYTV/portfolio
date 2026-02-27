export function TerminalPrompt({ path }: { path: string }) {
  return (
    <span className="terminal-prompt">
      <span style={{ color: "var(--terminal-user)" }}>visitor</span>
      <span className="text-muted-foreground">@</span>
      <span style={{ color: "var(--terminal-host)" }}>portfolio</span>
      <span className="text-muted-foreground"> </span>
      <span style={{ color: "var(--terminal-path)" }}>{path}</span>
      <span style={{ color: "var(--terminal-user)" }}> %</span>
    </span>
  );
}
