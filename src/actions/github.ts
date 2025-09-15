'use server';

import { Octokit } from '@octokit/rest';

import { env } from '@/env';
import type { GitHubRepository } from '@/types/github';

const EXCLUDED_ORGS = ['EpicGames'] as const;
const REPOS_PER_PAGE = 100;

export async function getGitHubRepositories(): Promise<GitHubRepository[]> {
  if (!env.GITHUB_TOKEN) {
    throw new Error('GitHub token not configured');
  }

  const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

  try {
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: REPOS_PER_PAGE,
      sort: 'updated',
      affiliation: 'owner,collaborator,organization_member'
    });

    return data
      .filter(
        repo =>
          !repo.private &&
          repo.updated_at &&
          !EXCLUDED_ORGS.some(org => repo.full_name.startsWith(`${org}/`))
      )
      .sort(
        (a, b) =>
          new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime()
      );
  } catch (error) {
    console.error('Failed to fetch GitHub repositories:', error);
    throw new Error('Unable to fetch repositories from GitHub');
  }
}
