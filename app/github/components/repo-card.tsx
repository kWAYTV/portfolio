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
            className={`block rounded-lg p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:translate-x-1 ${
                highlighted
                    ? "border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:shadow-[4px_4px_0px_0px] hover:shadow-neutral-300 dark:hover:shadow-neutral-700"
                    : "border border-neutral-200 dark:border-neutral-800 hover:shadow-[4px_4px_0px_0px] hover:shadow-neutral-200 dark:hover:shadow-neutral-800"
            }`}
        >
            <div className="flex flex-col h-full">
                <h3 className="text-lg font-medium mb-2 truncate">
                    {repo.name}
                </h3>
                <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400 flex-grow">
                    {repo.description || "No description available"}
                </p>
                <div className="flex flex-wrap items-center text-xs text-neutral-500 dark:text-neutral-400 mt-auto">
                    <div className="flex items-center space-x-4 w-full">
                        <span className="flex items-center">
                            <svg
                                className="w-4 h-4 mr-1"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"
                                />
                            </svg>
                            {repo.stargazers_count}
                        </span>
                        {repo.language && (
                            <span className="px-2 py-1 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                                {repo.language}
                            </span>
                        )}
                    </div>
                    <span className="w-full mt-2">
                        Updated: {formatDate(repo.updated_at, true)}
                    </span>
                </div>
            </div>
        </Link>
    );
}
