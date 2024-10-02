"use server";

import { Repo } from "@/types/github";
import { getBlogPosts } from "@/blog/utils";

export async function getGitHubRepos(username: string): Promise<{
    success: boolean;
    data?: {
        repos: Repo[];
        highlighted: Repo[];
        latest: Repo[];
    };
    error?: string;
}> {
    try {
        const res = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
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

        const blogPosts = getBlogPosts();
        const portfolioPost = blogPosts.find(
            (post) => post.slug === "hello-world"
        );

        // Convert updated_at to YYYY-MM-DD format
        repos.forEach((repo) => {
            repo.updated_at = repo.updated_at.split("T")[0];
            if (repo.name === "portfolio" && portfolioPost) {
                repo.updated_at = portfolioPost.metadata.publishedAt;
                console.log("Portfolio updated_at:", repo.updated_at);
            }
        });

        const sorted = repos
            .filter((repo) => !repo.fork) // Exclude forked repositories
            .sort((a, b) => b.stargazers_count - a.stargazers_count); // Sort by stars descending

        const highlighted: Repo[] = sorted.slice(0, 3);

        const latest: Repo[] = sorted
            .slice(3)
            .filter((repo) => !repo.fork)
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
                latest,
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
