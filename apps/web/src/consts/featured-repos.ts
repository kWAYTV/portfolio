// Add repo names you want to feature on the home page
// Uses exact match on repo.name or full_name
// If fewer than FEATURED_COUNT match, falls back to most starred repos
export const featuredRepoNames = [
  "ide-portfolio",
  "lichess-bot",
  "portfolio",
  "versend/core",
  "versend/homepage",
] as const;

export const FEATURED_COUNT = 3;
