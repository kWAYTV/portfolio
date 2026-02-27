import { EditorView } from "@codemirror/view";

export const editorTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent",
    fontSize: "clamp(11px, 2.5vw, 13px)",
    height: "100%",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-scroller": {
    fontFamily: "var(--font-mono), ui-monospace, monospace",
    lineHeight: "1.6",
    minHeight: "min-content",
    overflow: "auto",
    padding: "16px 0",
  },
  ".cm-gutters": {
    backgroundColor: "var(--background)",
    color: "var(--muted-foreground)",
    border: "none",
    borderRight: "1px solid var(--border)",
    paddingLeft: "8px",
    opacity: "0.4",
  },
  ".cm-gutter": {
    minWidth: "3em",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
  },
  ".cm-activeLine": {
    backgroundColor: "transparent",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--foreground)",
    borderLeftWidth: "1.5px",
  },
  ".cm-selectionBackground": {
    backgroundColor: "var(--accent) !important",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "var(--accent) !important",
  },
  ".cm-content": {
    caretColor: "var(--foreground)",
    padding: "0 16px",
  },
  ".cm-line": {
    padding: "0",
  },
});
