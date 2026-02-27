import { File, FileCode2, FileJson2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const fileTypeConfig: Record<string, { Icon: typeof File; color: string }> = {
  tsx: { Icon: FileCode2, color: "text-blue-500" },
  ts: { Icon: FileCode2, color: "text-blue-400" },
  md: { Icon: FileText, color: "text-sky-400" },
  mdx: { Icon: FileText, color: "text-amber-500" },
  json: { Icon: FileJson2, color: "text-yellow-500" },
  env: { Icon: File, color: "text-green-600" },
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
