export type Translate = (
  key: string,
  values?: Record<string, string | number>
) => string;

export type LineType = "input" | "output" | "error";

export interface CommandResult {
  cwd?: string;
  lines: { type: LineType; content: string }[];
}

export const out = (s: string): { type: LineType; content: string } => ({
  type: "output",
  content: s,
});

export const err = (s: string): { type: LineType; content: string } => ({
  type: "error",
  content: s,
});
