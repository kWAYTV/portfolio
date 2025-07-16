'use server';

import { Octokit } from '@octokit/rest';

import { env } from '@/env';
import type { GitHubRepository } from '@/types/github';

export async function getGitHubRepositories(): Promise<GitHubRepository[]> {
  if (!env.GITHUB_TOKEN) {
    throw new Error('GitHub token not configured');
  }

  try {
    const octokit = new Octokit({
      auth: env.GITHUB_TOKEN
    });

    const { data: repositories } =
      await octokit.rest.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: 'updated',
        affiliation: 'owner,collaborator,organization_member'
      });

    // Filter and sort with proper null handling
    return repositories
      .filter(repo => !repo.fork && !repo.archived && repo.updated_at)
      .map(repo => repo as GitHubRepository)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  } catch (error) {
    console.error('Failed to fetch GitHub repositories:', error);
    throw error;
  }
}
