'use server';

import { env } from '@/env';
import type { GitHubRepository } from '@/types/github';

export async function getGitHubRepositories(): Promise<GitHubRepository[]> {
  if (!env.GITHUB_TOKEN) {
    throw new Error('GitHub token not configured');
  }

  try {
    const response = await fetch(
      'https://api.github.com/user/repos?per_page=100&sort=updated',
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

    // Filter out forks and archived repos, sort by updated date
    return repositories
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
