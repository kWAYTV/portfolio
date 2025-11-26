import { GitFork, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { GitHubRepo } from "@/lib/github";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  repo: GitHubRepo;
  className?: string;
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
  Dart: "bg-teal-400",
  HTML: "bg-orange-600",
  CSS: "bg-blue-400",
  Shell: "bg-green-400",
  Lua: "bg-blue-800",
};

export function ProjectCard({ repo, className }: ProjectCardProps) {
  const languageColor = repo.language
    ? languageColors[repo.language] || "bg-muted-foreground"
    : null;

  return (
    <Link
      className={cn(
        "group block rounded-lg border border-border/50 bg-card/30 p-3 transition-all duration-200 hover:border-border hover:bg-card/60 sm:p-4",
        className
      )}
      href={repo.html_url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-foreground text-sm leading-tight transition-colors group-hover:text-primary sm:text-base">
            {repo.name}
          </h3>
          <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
            {repo.stargazers_count > 0 && (
              <span className="flex items-center gap-0.5 text-xs">
                <Star className="size-3" />
                {repo.stargazers_count}
              </span>
            )}
            {repo.forks_count > 0 && (
              <span className="flex items-center gap-0.5 text-xs">
                <GitFork className="size-3" />
                {repo.forks_count}
              </span>
            )}
          </div>
        </div>

        {repo.description && (
          <p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed sm:text-sm">
            {repo.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {languageColor && repo.language && (
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <span className={cn("size-2 rounded-full", languageColor)} />
              {repo.language}
            </span>
          )}
          {repo.topics.slice(0, 3).map((topic) => (
            <Badge
              className="h-5 px-1.5 text-[10px]"
              key={topic}
              variant="secondary"
            >
              {topic}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
