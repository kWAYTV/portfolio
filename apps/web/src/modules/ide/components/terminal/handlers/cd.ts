import type { CommandResult } from "@/modules/ide/components/terminal/handlers/types";

const RE_TRAILING_SLASH = /\/[^/]+$/;
const RE_SLASHES = /\/+/g;

export function runCd(parts: string[], cwd: string): CommandResult {
  const dir = parts[1] ?? "~";
  if (dir === "~" || dir === "~/") {
    return { lines: [], cwd: "/workspace/portfolio" };
  }
  if (dir === "..") {
    const next = cwd.replace(RE_TRAILING_SLASH, "") || "/workspace";
    return { lines: [], cwd: next };
  }
  if (dir === ".") {
    return { lines: [], cwd };
  }
  const next = dir.startsWith("/") ? dir : `${cwd}/${dir}`;
  return { lines: [], cwd: next.replace(RE_SLASHES, "/") };
}
