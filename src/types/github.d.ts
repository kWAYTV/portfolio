import type { RestEndpointMethodTypes } from '@octokit/rest';

export type GitHubRepository =
  RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data'][0];
