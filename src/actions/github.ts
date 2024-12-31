'use server';

import { Octokit } from '@octokit/rest';

import { env } from '@/env';
import type { Repository } from '@/interfaces/github';
import { githubUsername } from '@/lib/metadata';

export async function fetchGithubRepos() {
  try {
    const octokit = new Octokit({
      auth: env.GITHUB_TOKEN
    });

    const response = await octokit.repos.listForUser({
      username: githubUsername,
      sort: 'updated',
      per_page: 100
    });

    const allRepos = response.data
      .filter(repo => !repo.fork)
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        html_url: repo.html_url,
        private: repo.private,
        fork: repo.fork,
        archived: repo.archived,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count
      })) as Repository[];

    // Sort all repositories by update date
    const sortedRepos = allRepos.sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return dateB - dateA;
    });

    return { repos: sortedRepos };
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return { error: 'Failed to fetch repositories' };
  }
}
