import { getGitHubRepos } from "@/actions/github";
import { GitHubPageHeader } from "@/projects/components/header";
import { HighlightedProjects } from "@/projects/components/highlighted";
import { OtherProjects } from "@/projects/components/other";

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

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-16">
                <GitHubPageHeader />
                <HighlightedProjects repos={highlighted} />
                <OtherProjects repos={other} />
            </div>
        </div>
    );
}
