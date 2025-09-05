import type { RestEndpointMethodTypes } from '@octokit/rest';

// Use Octokit's built-in repository type for automatic updates
export type GitHubRepository =
  RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data'][0];

export interface GitHubApiResponse {
  repositories: GitHubRepository[];
  totalCount: number;
}
