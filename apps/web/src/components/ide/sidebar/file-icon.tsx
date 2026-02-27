import { File, FileCode2, FileJson2, FileKey, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

/** VS Code–inspired file icons. Extend as needed for css, html, etc. */
const fileTypeConfig: Record<string, { Icon: typeof File; color: string }> = {
  tsx: { Icon: FileCode2, color: "text-blue-500" },
  ts: { Icon: FileCode2, color: "text-blue-400" },
  jsx: { Icon: FileCode2, color: "text-amber-500" },
  js: { Icon: FileCode2, color: "text-amber-600" },
  md: { Icon: FileText, color: "text-sky-500" },
  mdx: { Icon: FileText, color: "text-orange-500" },
  json: { Icon: FileJson2, color: "text-amber-600" },
  env: { Icon: FileKey, color: "text-emerald-600" },
  css: { Icon: FileCode2, color: "text-pink-500" },
  html: { Icon: FileCode2, color: "text-orange-600" },
};

interface FileIconProps {
  className?: string;
  type: string;
}

export function FileIcon({ type, className }: FileIconProps) {
  const config = fileTypeConfig[type] ?? {
    Icon: File,
    color: "text-muted-foreground",
  };
  const { Icon, color } = config;
  return <Icon className={cn("size-4 shrink-0", color, className)} />;
}
