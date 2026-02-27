export const REPO_URL = "https://github.com/kWAYTV/ide-portfolio";

export interface MockCommit {
  author: string;
  date: string;
  filesChanged?: number;
  insertions?: number;
  message: string;
  sha: string;
}

export const MOCK_COMMITS: MockCommit[] = [
  {
    sha: "5dc4252",
    message: "Merge pull request #58 from kWAY_",
    author: "kWAY",
    date: "1 hours ago",
    filesChanged: 2,
    insertions: 15,
  },
  {
    sha: "e032295",
    message: "refactor(ide): remove redundant so...",
    author: "Cursor Agent",
    date: "1 hours ago",
    filesChanged: 3,
    insertions: 42,
  },
  {
    sha: "a1b2c3d",
    message: "chore: release v0.2.3",
    author: "kWAYTV",
    date: "2 hours ago",
    filesChanged: 1,
    insertions: 8,
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
];
