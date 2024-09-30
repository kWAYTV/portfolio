"use server";

import { Repo } from "app/types/github";

export async function getGitHubRepos(username: string): Promise<{
    success: boolean;
    data?: {
        repos: Repo[];
        highlighted: Repo[];
        other: Repo[];
    };
    error?: string;
}> {
    try {
        const res = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated`,
            {
                headers: {
                    Accept: "application/vnd.github.v3+json",
                },
                next: { revalidate: 3600 }, // Cache for 1 hour
            }
        );

        if (!res.ok) {
            throw new Error(`GitHub API responded with status ${res.status}`);
        }

        const repos: Repo[] = await res.json();

        const sorted = repos
            .filter((repo) => !repo.fork) // Exclude forked repositories
            .sort((a, b) => b.stargazers_count - a.stargazers_count); // Sort by stars descending

        const highlighted: Repo[] = sorted.slice(0, 3);
        const other: Repo[] = sorted
            .slice(3)
            .sort(
                (a, b) =>
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime()
            );

        return {
            success: true,
            data: {
                repos: sorted,
                highlighted,
                other,
            },
        };
    } catch (error) {
        console.error("Error fetching GitHub repos:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}
