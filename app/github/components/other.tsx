import type { Repo } from "app/types/github";
import { Link } from "next-view-transitions";
import { formatDate } from "app/blog/utils";

interface OtherProjectsProps {
    repos: Repo[];
}

export function OtherProjects({ repos }: OtherProjectsProps) {
    return (
        <section>
            <h2 className="text-3xl font-semibold mb-8 text-center">
                Other Projects
            </h2>
            <div>
                {repos.map((repo) => (
                    <Link
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col space-y-1 mb-4"
                    >
                        <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
                            <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                                {formatDate(repo.updated_at, false)}
                            </p>
                            <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                                {repo.name}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
