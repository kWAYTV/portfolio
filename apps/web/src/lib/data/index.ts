/**
 * Data layer - all data fetching with use cache.
 * Import from here for consistent caching and revalidation.
 */

export {
  getRepoCommits,
  getGitHubRepos,
  type GitCommitItem,
} from "@/lib/github";

export { getRSS } from "@/lib/rss";

export { getCachedBlogPage, blogSource } from "@/lib/source";

export { getFeaturedRepos } from "@/lib/featured";
