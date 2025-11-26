import { GitFork, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { GitHubRepo } from "@/lib/github";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  repo: GitHubRepo;
};

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Rust: "bg-orange-500",
  Go: "bg-cyan-400",
  Java: "bg-red-500",
  C: "bg-gray-500",
  "C++": "bg-pink-500",
  "C#": "bg-purple-500",
  Ruby: "bg-red-400",
  PHP: "bg-indigo-400",
  Swift: "bg-orange-400",
  Kotlin: "bg-violet-500",
  Shell: "bg-green-400",
  Lua: "bg-blue-800",
};

export function ProjectCard({ repo }: ProjectCardProps) {
  const languageColor = repo.language
    ? languageColors[repo.language] || "bg-muted-foreground"
    : null;

  return (
    <Link
      className="group -mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2.5 transition-all duration-200 hover:bg-muted/30"
      href={repo.html_url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {repo.description ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="truncate text-muted-foreground/70 text-xs transition-colors duration-200 group-hover:text-foreground sm:text-sm">
                {repo.name}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-64" side="bottom">
              {repo.description}
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="truncate text-muted-foreground/70 text-xs transition-colors duration-200 group-hover:text-foreground sm:text-sm">
            {repo.name}
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center text-muted-foreground/50 text-xs transition-colors duration-200 group-hover:text-muted-foreground/70">
        <span className="w-20 text-right">
          {languageColor && repo.language && (
            <Badge
              className="gap-1.5 border-transparent bg-muted/50 px-1.5 py-0 text-[10px] text-muted-foreground/70"
              variant="outline"
            >
              <span className={cn("size-1.5 rounded-full", languageColor)} />
              {repo.language}
            </Badge>
          )}
        </span>
        <span className="w-10 text-right tabular-nums">
          {repo.stargazers_count > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center justify-end gap-1">
                  <Star className="size-3" />
                  {repo.stargazers_count}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                {repo.stargazers_count} star
                {repo.stargazers_count !== 1 && "s"}
              </TooltipContent>
            </Tooltip>
          )}
        </span>
        <span className="w-10 text-right tabular-nums">
          {repo.forks_count > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center justify-end gap-1">
                  <GitFork className="size-3" />
                  {repo.forks_count}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                {repo.forks_count} fork{repo.forks_count !== 1 && "s"}
              </TooltipContent>
            </Tooltip>
          )}
        </span>
      </div>
    </Link>
  );
}
