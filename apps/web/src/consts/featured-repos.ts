// Add repo names you want to feature on the home page
// Uses exact match on repo.name (not full_name)
// If fewer than 3 match, falls back to most starred repos
export const featuredRepoNames = [
  "portfolio",
  "versend/core",
  "lichess-bot",
] as const;

export const FEATURED_COUNT = 3;
