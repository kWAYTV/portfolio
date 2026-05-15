import {
  type CommandResult,
  err,
  out,
  type Translate,
} from "@/modules/ide/components/terminal/handlers/types";

const RE_MSG_QUOTES = /^["']|["']$/g;

function randomHash(): string {
  return [...crypto.getRandomValues(new Uint8Array(4))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 7);
}

function gitStatus(t: Translate): CommandResult {
  return {
    lines: [
      out(t("cmdOutput.gitOnBranch")),
      out(t("cmdOutput.gitUpToDate")),
      out(""),
      out(t("cmdOutput.gitChangesNotStaged")),
      out(t("cmdOutput.gitUseAdd")),
      out(
        t("cmdOutput.gitModifiedLine", {
          path: "apps/web/src/app/[locale]/blog/page.tsx",
        })
      ),
      out(
        t("cmdOutput.gitModifiedLine", {
          path: "apps/web/src/components/shared/pagination.tsx",
        })
      ),
      out(""),
      out(t("cmdOutput.gitNoChangesToCommit")),
    ],
  };
}

function gitCommit(parts: string[], t: Translate): CommandResult {
  const mIdx = parts.indexOf("-m");
  const msg =
    mIdx >= 0
      ? parts
          .slice(mIdx + 1)
          .join(" ")
          .replace(RE_MSG_QUOTES, "")
          .trim() || null
      : null;

  if (!msg) {
    return {
      lines: [
        out(t("cmdOutput.gitConventionalFormat")),
        out(`  ${t("cmdOutput.gitCommitExample")}`),
        out(t("cmdOutput.gitCommitTypes")),
      ],
    };
  }

  const files = 1 + Math.floor(Math.random() * 5);
  const ins = Math.floor(Math.random() * 120) + 1;
  const del = Math.floor(Math.random() * 40);
  return {
    lines: [
      out(t("cmdOutput.gitCommitSuccess", { hash: randomHash(), msg })),
      out(t("cmdOutput.gitCommitStats", { files, ins, del })),
    ],
  };
}

function gitLog(t: Translate): CommandResult {
  return {
    lines: [
      out(t("cmdOutput.gitLogCommit", { hash: randomHash() })),
      out(t("cmdOutput.gitLogAuthor")),
      out(t("cmdOutput.gitLogDate")),
      out(""),
      out(t("cmdOutput.gitLogMessage")),
    ],
  };
}

export function runGit(parts: string[], t: Translate): CommandResult {
  const sub = parts[1]?.toLowerCase();
  switch (sub) {
    case "status":
      return gitStatus(t);
    case "commit":
      return gitCommit(parts, t);
    case "log":
      return gitLog(t);
    default:
      return {
        lines: [err(t("cmdOutput.gitNotACommand", { sub: sub ?? "" }))],
      };
  }
}
