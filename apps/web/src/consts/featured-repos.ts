// Add repo names you want to feature on the home page
// Uses exact match on repo.name or full_name
// If fewer than FEATURED_COUNT match, falls back to most starred repos
export const featuredRepoNames = [
  "lichess-bot",
  "portfolio",
  "versend/core",
] as const;

export const FEATURED_COUNT = 3;
