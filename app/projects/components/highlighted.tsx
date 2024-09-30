import { RepoCard } from "@/projects/components/repo-card";
import type { Repo } from "@/types/github";

interface HighlightedProjectsProps {
    repos: Repo[];
}

export function HighlightedProjects({ repos }: HighlightedProjectsProps) {
    return (
        <section>
            <h2 className="text-3xl font-semibold mb-8 text-center">
                Highlighted Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {repos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} highlighted={true} />
                ))}
            </div>
        </section>
    );
}
