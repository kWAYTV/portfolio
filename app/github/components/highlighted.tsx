import { RepoCard } from "./repo-card";
import type { Repo } from "app/types/github";

interface HighlightedProjectsProps {
    repos: Repo[];
}

export function HighlightedProjects({ repos }: HighlightedProjectsProps) {
    return (
        <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">
                Highlighted Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {repos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                ))}
            </div>
        </section>
    );
}
