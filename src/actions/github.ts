'use server';

import { Octokit } from '@octokit/rest';
import { cache } from 'react';

import { env } from '@/env';
import type { Repository } from '@/interfaces/github';
import { githubUsername } from '@/lib/metadata';

// Use React's cache function to avoid redundant GitHub API calls
export const fetchGithubRepos = cache(async () => {
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
        homepage: repo.homepage,
        private: repo.private,
        fork: repo.fork,
        archived: repo.archived,
        topics: repo.topics || [],
        license: repo.license,
        visibility: repo.visibility,
        is_template: repo.is_template,
        open_issues_count: repo.open_issues_count,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        language: repo.language,
        default_branch: repo.default_branch,
        stargazers_count: repo.stargazers_count,
        watchers_count: repo.watchers_count,
        forks_count: repo.forks_count,
        organization:
          repo.owner.type === 'Organization'
            ? {
                login: repo.owner.login,
                avatar_url: repo.owner.avatar_url
              }
            : undefined
      })) as Repository[];

    // Sort all repositories by update date
    const sortedRepos = allRepos.sort((a, b) => {
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();
      return dateB - dateA;
    });

    return { repos: sortedRepos };
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return { error: 'Failed to fetch repositories' };
  }
});
