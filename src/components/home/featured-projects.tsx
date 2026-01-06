import { ExternalLink, GitFork, Star } from "lucide-react";
import Link from "next/link";
import type { GitHubRepo } from "@/lib/github";
import { cn } from "@/lib/utils";

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Rust: "bg-orange-500",
  Go: "bg-cyan-400",
};

type FeaturedProjectsProps = {
  repos: GitHubRepo[];
};

export function FeaturedProjects({ repos }: FeaturedProjectsProps) {
  if (repos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-xs tracking-tight sm:text-sm">
          Featured
        </h2>
        <Link
          className="text-[10px] text-muted-foreground/50 transition-colors hover:text-muted-foreground sm:text-xs"
          href="/projects"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-2">
        {repos.map((repo) => (
          <a
            className="group flex items-center justify-between gap-3 rounded-md border border-transparent bg-muted/20 px-3 py-2.5 transition-all duration-200 hover:border-border/50 hover:bg-muted/40"
            href={repo.html_url}
            key={repo.id}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-foreground/90 text-xs transition-colors group-hover:text-foreground sm:text-sm">
                  {repo.name}
                </span>
                <ExternalLink className="size-3 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground" />
              </div>
              {repo.description && (
                <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground/60 sm:text-xs">
                  {repo.description}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 text-[10px] text-muted-foreground/50 sm:gap-3 sm:text-xs">
              {repo.language && (
                <span className="flex items-center gap-1">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      languageColors[repo.language] || "bg-muted-foreground/50"
                    )}
                  />
                  <span className="hidden sm:inline">{repo.language}</span>
                </span>
              )}
              <span className="flex items-center gap-0.5">
                <Star className="size-3" />
                {repo.stargazers_count}
              </span>
              <span className="flex items-center gap-0.5">
                <GitFork className="size-3" />
                {repo.forks_count}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
