export const MOCK_CWD = "/workspace/portfolio";
export const MOCK_FILES = [
  "package.json",
  "tsconfig.json",
  "README.md",
  ".env",
  "src",
  "apps",
  "packages",
];

export const MOCK_DIRS = ["src", "apps", "packages", ".", "..", "~"];
export const COMMANDS = [
  "clear",
  "pwd",
  "ls",
  "cd",
  "cat",
  "echo",
  "whoami",
  "date",
  "help",
  "?",
  "npm",
  "pnpm",
  "git",
];

export type OutputLine =
  | { type: "output"; content: string }
  | { type: "error"; content: string }
  | { type: "ls-line"; content: string; isDir: boolean };

export type TerminalTranslations = {
  helpIntro: string;
  helpLs: string;
  helpPwd: string;
  helpCd: string;
  helpCat: string;
  helpCat2: string;
  helpEcho: string;
  helpClear: string;
  helpWhoami: string;
  helpDate: string;
  helpHelp: string;
  helpEasterEggs: string;
};

export const DEFAULT_HELP: TerminalTranslations = {
  helpIntro: "Available commands:",
  helpLs: "  ls, ls -la    List files",
  helpPwd: "  pwd           Print working directory",
  helpCd: "  cd <dir>      Change directory",
  helpCat:
    "  cat <file>   Display file (package.json, tsconfig.json, README.md,",
  helpCat2:
    "               .env, about.md, src/welcome.tsx, src/projects.ts, etc.)",
  helpEcho: "  echo <text>   Echo text",
  helpClear: "  clear         Clear terminal",
  helpWhoami: "  whoami        Current user",
  helpDate: "  date          Current date/time",
  helpHelp: "  help, ?       Show this help",
  helpEasterEggs: "Easter eggs: pnpm run dev, git status",
};
