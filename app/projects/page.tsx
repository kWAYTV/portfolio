import { getGitHubRepos } from "app/actions/github";
import { GitHubPageHeader } from "app/projects/components/header";
import { HighlightedProjects } from "app/projects/components/highlighted";
import { OtherProjects } from "app/projects/components/other";

export const revalidate = 3600; // Revalidate every hour

async function getRepos() {
    const result = await getGitHubRepos("kWAYTV");
    if (!result.success || !result.data) {
        throw new Error("Failed to fetch GitHub repos");
    }
    return result.data;
}

export default async function GitHubPage() {
    const { highlighted, other } = await getRepos();

    const sortedOtherRepos = other
        .filter((repo) => !repo.fork)
        .sort(
            (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
        );

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-16">
                <GitHubPageHeader />
                <HighlightedProjects repos={highlighted} />
                <OtherProjects repos={sortedOtherRepos} />
            </div>
        </div>
    );
}
