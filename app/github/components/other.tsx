import Link from "next/link";
import { formatDate } from "app/blog/utils";
import type { Repo } from "app/types/github";

interface OtherProjectsProps {
    repos: Repo[];
}

export function OtherProjects({ repos }: OtherProjectsProps) {
    return (
        <section>
            <h2 className="text-2xl font-semibold mb-6 text-center">
                Other Projects
            </h2>
            <div className="rounded-lg overflow-hidden border">
                <ul className="divide-y">
                    {repos.map((repo) => (
                        <li key={repo.id} className="p-4">
                            <Link
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-between items-center"
                            >
                                <div className="flex-grow">
                                    <h3 className="text-lg font-medium truncate">
                                        {repo.name}
                                    </h3>
                                    <p className="text-sm h-6 overflow-hidden">
                                        {repo.description ||
                                            "No description available"}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end text-sm ml-4">
                                    <span>⭐ {repo.stargazers_count}</span>
                                    <span>
                                        Updated:{" "}
                                        {formatDate(repo.updated_at, false)}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
