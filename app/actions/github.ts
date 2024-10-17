"use server";

import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function getGithubRepos(
	page = 1,
	perPage = 10,
	searchQuery = "",
) {
	try {
		const { data: repos } = await octokit.repos.listForAuthenticatedUser({
			sort: "updated",
			direction: "desc",
			per_page: perPage,
			page: page,
		});

		// Filter repos based on the search query
		const filteredRepos = searchQuery
			? repos.filter((repo) =>
					repo.name.toLowerCase().includes(searchQuery.toLowerCase()),
				)
			: repos;

		// Get total count of repos for pagination
		const { data: user } = await octokit.users.getAuthenticated();
		const totalRepos = user.public_repos + (user.total_private_repos ?? 0);

		return {
			repos: filteredRepos,
			totalPages: Math.ceil(totalRepos / perPage),
			currentPage: page,
		};
	} catch (error) {
		console.error("Error fetching GitHub repos:", error);
		throw new Error("Failed to fetch GitHub repositories");
	}
}
