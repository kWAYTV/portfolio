import type { GitCommitItem } from "@/lib/github";

export const PORTFOLIO_REPO_URL = "https://github.com/kWAYTV/portfolio";

export interface CommitWithStats extends GitCommitItem {
  filesChanged?: number;
  insertions?: number;
}

export const MOCK_COMMITS: CommitWithStats[] = [
  {
    sha: "a1b2c3d",
    message: "feat(ide): add VS Code-style source control panel",
    author: "kWAYTV",
    date: "2 hours ago",
    filesChanged: 3,
    insertions: 42,
  },
  {
    sha: "e4f5g6h",
    message: "chore: update dependencies",
    author: "kWAYTV",
    date: "1 day ago",
    filesChanged: 2,
    insertions: 6,
  },
  {
    sha: "i7j8k9l",
    message: "fix: resolve layout issues on mobile",
    author: "kWAYTV",
    date: "2 days ago",
    filesChanged: 5,
    insertions: 12,
  },
  {
    sha: "m0n1o2p",
    message: "feat: add blog section",
    author: "kWAYTV",
    date: "1 week ago",
    filesChanged: 8,
    insertions: 120,
  },
  {
    sha: "q3r4s5t",
    message: "style: improve theme consistency",
    author: "kWAYTV",
    date: "2 weeks ago",
    filesChanged: 4,
    insertions: 18,
  },
];
