import {
  type CommandResult,
  err,
  out,
  type Translate,
} from "@/modules/ide/components/terminal/handlers/types";

const RE_TILDE_PREFIX = /^~\//;
const RE_WORKSPACE_PREFIX = /^\/workspace\/portfolio\/?/;

const MOCK_FILE_CONTENTS: Record<string, string> = {
  "package.json": `{
  "name": "ide-portfolio",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "type": "module",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build"
  }
}`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2017",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["./**/*.ts", "./**/*.tsx"]
}`,
  "README.md": `# ide-portfolio

Portfolio built as an IDE-inspired experience.
`,
  ".env": "# Env vars (redacted)",
  "page.tsx": `export default function Page() {
  return <main>Home</main>;
}`,
  "about.mdx": `# About

Portfolio about page.`,
  "projects.ts": "export const projects = [];",
  "src/page.tsx": `export default function Page() {
  return <main>Home</main>;
}`,
  "src/about.mdx": "# About",
  "src/projects.ts": "export const projects = [];",
  "src/blog/index.mdx": "# Blog",
};

export function runCat(parts: string[], t: Translate): CommandResult {
  const file = parts[1];
  if (!file) {
    return { lines: [err(t("cmdOutput.catMissingOperand"))] };
  }
  const normalized =
    file.replace(RE_TILDE_PREFIX, "").replace(RE_WORKSPACE_PREFIX, "") || ".";
  const content = MOCK_FILE_CONTENTS[normalized] ?? MOCK_FILE_CONTENTS[file];
  if (content) {
    return { lines: content.split("\n").map(out) };
  }
  return { lines: [err(t("cmdOutput.catNoSuchFile", { file }))] };
}
