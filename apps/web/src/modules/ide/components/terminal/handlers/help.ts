import {
  type CommandResult,
  out,
  type Translate,
} from "@/modules/ide/components/terminal/handlers/types";

export function runHelp(t: Translate): CommandResult {
  return {
    lines: [
      out(t("cmdOutput.cmdHelpAvailable")),
      out(""),
      out(t("cmdOutput.cmdHelpGitStatus")),
      out(t("cmdOutput.cmdHelpGitCommit")),
      out(""),
      out(t("cmdOutput.cmdHelpCat")),
      out(t("cmdOutput.cmdHelpEcho")),
      out(t("cmdOutput.cmdHelpClear")),
      out(t("cmdOutput.cmdHelpLs")),
      out(t("cmdOutput.cmdHelpPwd")),
      out(t("cmdOutput.cmdHelpCd")),
      out(t("cmdOutput.cmdHelpHelp")),
    ],
  };
}
