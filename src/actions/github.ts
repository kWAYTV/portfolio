'use server';

import { Octokit } from '@octokit/rest';

import { env } from '@/env';
import type { GitHubRepository } from '@/types/github';

/**
 * Organizations to exclude from repository list
 */
const EXCLUDED_ORGS = ['EpicGames'];

/**
 * Sort repositories by updated date (newest first)
 */
function sortByUpdatedDate(a: GitHubRepository, b: GitHubRepository): number {
  const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
  const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
  return bTime - aTime;
}

/**
 * Check if repository should be excluded based on organization
 */
function isExcludedOrg(repo: GitHubRepository): boolean {
  return EXCLUDED_ORGS.some(org => repo.full_name.startsWith(`${org}/`));
}

/**
 * Filter repositories to include only public, non-excluded repos with valid dates
 */
function shouldIncludeRepo(repo: GitHubRepository): boolean {
  return !repo.private && repo.updated_at !== null && !isExcludedOrg(repo);
}

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

    return repositories
      .filter(shouldIncludeRepo)
      .map(repo => repo as GitHubRepository)
      .sort(sortByUpdatedDate);
  } catch (error) {
    console.error('Failed to fetch GitHub repositories:', error);
    throw error;
  }
}
