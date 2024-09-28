import Link from "next/link";
import { formatDate } from "app/blog/utils";
import type { Repo } from "app/types/github";

interface RepoCardProps {
    repo: Repo;
    highlighted?: boolean;
}

export function RepoCard({ repo, highlighted = false }: RepoCardProps) {
    return (
        <Link
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block rounded-lg p-6 border transition-all duration-300 hover:shadow-lg ${
                highlighted ? "border-2" : "border"
            }`}
        >
            <div className="flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-2 truncate">
                    {repo.name}
                </h3>
                <p className="mb-4 text-sm flex-grow">
                    {repo.description || "No description available"}
                </p>
                <div className="flex flex-wrap items-center text-sm mt-auto">
                    <span className="mr-4 mb-2">
                        ⭐ {repo.stargazers_count}
                    </span>
                    <span className="mr-4 mb-2">{repo.language}</span>
                    <span className="mb-2">
                        Updated: {formatDate(repo.updated_at, true)}
                    </span>
                </div>
            </div>
        </Link>
    );
}
