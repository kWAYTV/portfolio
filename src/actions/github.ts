'use server';

import { env } from '@/env';
import type { GitHubRepository } from '@/types/github';

export async function getGitHubRepositories(): Promise<GitHubRepository[]> {
  if (!env.GITHUB_TOKEN) {
    throw new Error('GitHub token not configured');
  }

  try {
    const allRepositories: GitHubRepository[] = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await fetch(
        `https://api.github.com/user/repos?per_page=100&sort=updated&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-App'
          },
          next: {
            revalidate: 3600 // Revalidate every hour
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`
        );
      }

      const repositories: GitHubRepository[] = await response.json();

      // If we got fewer than 100 repos, we've reached the last page
      if (repositories.length < 100) {
        hasNextPage = false;
      }

      allRepositories.push(...repositories);
      page++;

      // Safety check to prevent infinite loops
      if (page > 50) {
        console.warn(
          'Stopped fetching after 50 pages (5000 repos) to prevent infinite loop'
        );
        break;
      }
    }

    console.log(`Fetched ${allRepositories.length} total repositories`);

    // Filter out forks and archived repos, sort by updated date
    return allRepositories
      .filter(repo => !repo.fork && !repo.archived)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  } catch (error) {
    console.error('Failed to fetch GitHub repositories:', error);
    throw error;
  }
}
