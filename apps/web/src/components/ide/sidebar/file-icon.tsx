import {
  File,
  FileCode2,
  FileImage,
  FileJson2,
  FileKey,
  FileLock2,
  FileText,
  GitCompare,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** File icons – VS Code–style colored palette. */
const fileTypeConfig: Record<string, { Icon: typeof File; color: string }> = {
  tsx: { Icon: FileCode2, color: "var(--file-icon-tsx)" },
  ts: { Icon: FileCode2, color: "var(--file-icon-ts)" },
  jsx: { Icon: FileCode2, color: "var(--file-icon-jsx)" },
  js: { Icon: FileCode2, color: "var(--file-icon-js)" },
  css: { Icon: FileCode2, color: "var(--file-icon-css)" },
  scss: { Icon: FileCode2, color: "var(--file-icon-css)" },
  sass: { Icon: FileCode2, color: "var(--file-icon-css)" },
  html: { Icon: FileCode2, color: "var(--file-icon-mdx)" },
  vue: { Icon: FileCode2, color: "var(--file-icon-env)" },
  svelte: { Icon: FileCode2, color: "var(--file-icon-mdx)" },
  json: { Icon: FileJson2, color: "var(--file-icon-json)" },
  yaml: { Icon: FileJson2, color: "var(--file-icon-json)" },
  yml: { Icon: FileJson2, color: "var(--file-icon-json)" },
  env: { Icon: FileKey, color: "var(--file-icon-env)" },
  md: { Icon: FileText, color: "var(--file-icon-md)" },
  mdx: { Icon: FileText, color: "var(--file-icon-mdx)" },
  diff: { Icon: GitCompare, color: "var(--file-icon-diff)" },
  patch: { Icon: GitCompare, color: "var(--file-icon-diff)" },
  svg: { Icon: FileImage, color: "var(--file-icon-mdx)" },
  png: { Icon: FileImage, color: "var(--file-icon-env)" },
  jpg: { Icon: FileImage, color: "var(--file-icon-env)" },
  webp: { Icon: FileImage, color: "var(--file-icon-env)" },
  lock: { Icon: FileLock2, color: "var(--muted-foreground)" },
};

/** Derive file type from filename for icon lookup. */
export function getFileTypeFromName(name: string): string {
  if (name.startsWith(".")) {
    if (name === ".env" || name.endsWith(".env")) {
      return "env";
    }
    return name.slice(1).split(".").at(-1) ?? "unknown";
  }
  const ext = name.split(".").at(-1) ?? "";
  if (
    name === "package-lock.json" ||
    name === "pnpm-lock.yaml" ||
    name === "yarn.lock"
  ) {
    return "lock";
  }
  return ext.toLowerCase();
}

interface FileIconProps {
  className?: string;
  /** File name – used to derive type when `type` is not provided */
  name?: string;
  /** Explicit file type (e.g. "tsx", "diff"). Overrides `name` when set. */
  type?: string;
}

export function FileIcon({ className, name, type }: FileIconProps) {
  const resolvedType = type ?? (name ? getFileTypeFromName(name) : "unknown");
  const config = fileTypeConfig[resolvedType] ?? {
    Icon: File,
    color: "var(--muted-foreground)",
  };
  const { Icon, color } = config;
  const isVar = color.startsWith("var(");
  return (
    <Icon
      className={cn("size-4 shrink-0", !isVar && color, className)}
      style={isVar ? { color } : undefined}
    />
  );
}
