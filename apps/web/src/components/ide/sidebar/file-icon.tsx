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

/** File icons using shadcn theme vars. tsx/ts/mdx distinct. */
const fileTypeConfig: Record<string, { Icon: typeof File; color: string }> = {
  // Code – tsx primary, ts muted
  tsx: { Icon: FileCode2, color: "text-primary" },
  ts: { Icon: FileCode2, color: "text-muted-foreground" },
  jsx: { Icon: FileCode2, color: "text-chart-1" },
  js: { Icon: FileCode2, color: "text-muted-foreground" },
  css: { Icon: FileCode2, color: "text-chart-2" },
  scss: { Icon: FileCode2, color: "text-chart-2" },
  sass: { Icon: FileCode2, color: "text-chart-2" },
  html: { Icon: FileCode2, color: "text-muted-foreground" },
  vue: { Icon: FileCode2, color: "text-chart-1" },
  svelte: { Icon: FileCode2, color: "text-chart-1" },
  // Data/config
  json: { Icon: FileJson2, color: "text-chart-1" },
  yaml: { Icon: FileJson2, color: "text-chart-2" },
  yml: { Icon: FileJson2, color: "text-chart-2" },
  env: { Icon: FileKey, color: "text-chart-1" },
  // Docs – mdx amber (chart-1), md muted
  md: { Icon: FileText, color: "text-muted-foreground" },
  mdx: { Icon: FileText, color: "text-chart-1" },
  // Diff / version control
  diff: { Icon: GitCompare, color: "text-chart-2" },
  patch: { Icon: GitCompare, color: "text-chart-2" },
  // Assets
  svg: { Icon: FileImage, color: "text-chart-1" },
  png: { Icon: FileImage, color: "text-muted-foreground" },
  jpg: { Icon: FileImage, color: "text-muted-foreground" },
  webp: { Icon: FileImage, color: "text-muted-foreground" },
  // Lock files
  lock: { Icon: FileLock2, color: "text-muted-foreground" },
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
    color: "text-muted-foreground",
  };
  const { Icon, color } = config;
  return <Icon className={cn("size-4 shrink-0", color, className)} />;
}
