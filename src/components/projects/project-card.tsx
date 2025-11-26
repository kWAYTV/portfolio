import { GitFork, Star } from "lucide-react";
import Link from "next/link";
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
      className="group flex items-center justify-between gap-3 py-2 transition-colors"
      href={repo.html_url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {languageColor && repo.language && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn("size-2 shrink-0 rounded-full", languageColor)}
              />
            </TooltipTrigger>
            <TooltipContent side="top">{repo.language}</TooltipContent>
          </Tooltip>
        )}
        <span className="truncate text-muted-foreground text-xs transition-colors group-hover:text-foreground sm:text-sm">
          {repo.name}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2 text-muted-foreground/60 text-xs">
        {repo.stargazers_count > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-0.5">
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
        {repo.forks_count > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-0.5">
                <GitFork className="size-3" />
                {repo.forks_count}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              {repo.forks_count} fork{repo.forks_count !== 1 && "s"}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </Link>
  );
}
