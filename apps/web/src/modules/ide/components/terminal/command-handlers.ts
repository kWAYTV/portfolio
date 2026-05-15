import { runCat } from "@/modules/ide/components/terminal/handlers/cat";
import { runCd } from "@/modules/ide/components/terminal/handlers/cd";
import { runGit } from "@/modules/ide/components/terminal/handlers/git";
import { runHelp } from "@/modules/ide/components/terminal/handlers/help";
import { runLs } from "@/modules/ide/components/terminal/handlers/ls";
import {
  type CommandResult,
  err,
  out,
  type Translate,
} from "@/modules/ide/components/terminal/handlers/types";

export type { CommandResult } from "@/modules/ide/components/terminal/handlers/types";

const RE_WHITESPACE = /\s+/;

export function executeCommand(
  cmd: string,
  cwd: string,
  t: Translate
): CommandResult {
  const trimmed = cmd.trim();
  const parts = trimmed.split(RE_WHITESPACE);
  const cmdName = parts[0]?.toLowerCase() ?? "";

  switch (cmdName) {
    case "":
      return { lines: [] };
    case "clear":
      return { lines: [] };
    case "pwd":
      return { lines: [out(cwd.replace("/workspace/portfolio", "~"))] };
    case "ls": {
      const long = parts.some(
        (p) => p === "-l" || p === "-a" || p === "-la" || p === "-al"
      );
      return runLs(cwd, long);
    }
    case "whoami":
      return { lines: [out(t("cmdOutput.whoami"))] };
    case "help":
    case "?":
      return runHelp(t);
    case "cat":
      return runCat(parts, t);
    case "echo":
      return { lines: [out(parts.slice(1).join(" "))] };
    case "cd":
      return runCd(parts, cwd);
    case "git":
      return runGit(parts, t);
    default:
      return {
        lines: [err(t("cmdOutput.commandNotFound", { cmd: parts[0] ?? cmd }))],
      };
  }
}
