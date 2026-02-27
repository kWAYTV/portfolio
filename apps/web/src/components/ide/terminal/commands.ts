const COMMANDS = [
  "clear",
  "pwd",
  "ls",
  "cd",
  "cat",
  "echo",
  "whoami",
  "git",
  "help",
  "?",
];
const MOCK_DIRS = ["src", "blog", ".", "..", "~"];
const MOCK_FILES = [
  "package.json",
  "tsconfig.json",
  "README.md",
  ".env",
  "page.tsx",
  "about.mdx",
  "projects.ts",
  "index.mdx",
];

const RE_WHITESPACE = /\s+/;
const RE_SRC_PREFIX = /^src\//;

export function getTabCompletions(input: string): string[] {
  const trimmed = input.trimEnd();
  const parts = trimmed.split(RE_WHITESPACE);
  const lastPart = parts.at(-1) ?? "";
  const prefix = lastPart.toLowerCase();

  if (parts.length <= 1) {
    return COMMANDS.filter(
      (c) => c.startsWith(prefix) || c.startsWith(lastPart)
    );
  }

  const cmd = parts[0]?.toLowerCase();
  if (cmd === "git") {
    return ["status", "commit", "log", "diff"].filter(
      (g) => g.startsWith(prefix) || g.startsWith(lastPart)
    );
  }
  if (cmd === "cat") {
    return MOCK_FILES.filter(
      (f) =>
        f.toLowerCase().startsWith(prefix) ||
        f.replace(RE_SRC_PREFIX, "").toLowerCase().startsWith(prefix)
    );
  }
  if (cmd === "cd") {
    return MOCK_DIRS.filter(
      (d) => d.toLowerCase().startsWith(prefix) || d.startsWith(lastPart)
    );
  }
  return [];
}

export function applyTabCompletion(
  input: string,
  completions: string[]
): string {
  if (completions.length === 0) {
    return input;
  }
  const trimmed = input.trimEnd();
  const parts = trimmed.split(RE_WHITESPACE);
  const lastPart = parts.at(-1) ?? "";
  const prefix = lastPart.toLowerCase();

  const matches = completions.filter(
    (c) => c.toLowerCase().startsWith(prefix) || c.startsWith(lastPart)
  );
  if (matches.length === 0) {
    return input;
  }

  if (matches.length === 1) {
    const before = parts.slice(0, -1).join(" ");
    const suffix = ["cd", "cat"].includes(parts[0]?.toLowerCase() ?? "")
      ? " "
      : "";
    return before
      ? `${before} ${matches[0]}${suffix}`
      : `${matches[0]}${suffix}`;
  }

  let commonPrefix = matches[0] ?? "";
  for (const s of matches.slice(1)) {
    let i = 0;
    const a = commonPrefix.toLowerCase();
    const b = s.toLowerCase();
    while (i < a.length && i < b.length && a[i] === b[i]) {
      i++;
    }
    commonPrefix = commonPrefix.slice(0, i);
  }
  const before = parts.slice(0, -1).join(" ");
  return before ? `${before} ${commonPrefix}` : commonPrefix;
}

export function getGhostSuggestion(input: string): string | null {
  const completions = getTabCompletions(input);
  if (completions.length === 0) {
    return null;
  }

  const fullCompletion = applyTabCompletion(input, completions);
  const trimmed = input.trimEnd();
  if (fullCompletion === trimmed) {
    return null;
  }

  const parts = trimmed.split(RE_WHITESPACE);
  const lastPart = parts.at(-1) ?? "";
  const prefix = lastPart.toLowerCase();

  const matches = completions.filter(
    (c) => c.toLowerCase().startsWith(prefix) || c.startsWith(lastPart)
  );
  if (matches.length === 0) {
    return null;
  }

  if (matches.length === 1) {
    const completed = matches[0];
    const suffix = ["cd", "cat"].includes(parts[0]?.toLowerCase() ?? "")
      ? " "
      : "";
    return completed.slice(lastPart.length) + suffix;
  }

  let commonPrefix = matches[0] ?? "";
  for (const s of matches.slice(1)) {
    let i = 0;
    const a = commonPrefix.toLowerCase();
    const b = s.toLowerCase();
    while (i < a.length && i < b.length && a[i] === b[i]) {
      i++;
    }
    commonPrefix = commonPrefix.slice(0, i);
  }
  const added = commonPrefix.slice(lastPart.length);
  return added || null;
}
