import type { Repo } from "@/types/github";
import { Link } from "next-view-transitions";
import { formatDate } from "@/blog/utils";

interface LatestProjectsProps {
    repos: Repo[];
}

export function LatestProjects({ repos }: LatestProjectsProps) {
    return (
        <section>
            <h2 className="text-3xl font-semibold mb-8 text-center">
                Latest Projects
            </h2>
            <div>
                {repos.map((repo) => (
                    <div key={repo.id} className="flex flex-col space-y-1 mb-4">
                        <div className="w-full flex flex-col md:flex-row md:items-center space-x-0 md:space-x-2">
                            <div className="text-neutral-600 dark:text-neutral-400 w-[180px] tabular-nums flex flex-col">
                                <span>
                                    {formatDate(repo.updated_at, false)}
                                </span>
                                <span className="text-sm">
                                    {formatDate(repo.updated_at, true)
                                        .split("(")[1]
                                        .slice(0, -1)}
                                </span>
                            </div>
                            <Link
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-900 dark:text-neutral-100 tracking-tight flex-grow hover:underline"
                            >
                                {repo.name}
                            </Link>
                            <div className="flex items-center text-neutral-600 dark:text-neutral-400">
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
                                <span>{repo.stargazers_count}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
