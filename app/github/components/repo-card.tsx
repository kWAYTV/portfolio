import Link from "next/link";
import { formatDate } from "app/blog/utils";
import type { Repo } from "app/types/github";

interface RepoCardProps {
    repo: Repo;
}

export function RepoCard({ repo }: RepoCardProps) {
    return (
        <div className="rounded-lg p-6 flex flex-col justify-between h-full border">
            <div>
                <h3 className="text-xl font-semibold mb-2 truncate">
                    {repo.name}
                </h3>
                <p className="mb-4 text-sm h-12 overflow-hidden">
                    {repo.description || "No description available"}
                </p>
            </div>
            <div className="flex flex-col space-y-2 text-sm">
                <span>⭐ {repo.stargazers_count} stars</span>
                <span>Updated: {formatDate(repo.updated_at, false)}</span>
                <Link
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    View on GitHub
                </Link>
            </div>
        </div>
    );
}
