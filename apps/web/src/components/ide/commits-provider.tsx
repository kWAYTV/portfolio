"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { getCommits } from "@/lib/actions";
import type { GitCommitItem } from "@/lib/github";

const CommitsContext = createContext<{
  commits: GitCommitItem[];
  fetchCommits: () => Promise<void>;
  isLoading: boolean;
}>({
  commits: [],
  fetchCommits: async () => {},
  isLoading: false,
});

export function useCommits() {
  return useContext(CommitsContext);
}

interface CommitsProviderProps {
  children: React.ReactNode;
  initialCommits?: GitCommitItem[];
}

export function CommitsProvider({
  children,
  initialCommits = [],
}: CommitsProviderProps) {
  const [commits, setCommits] = useState<GitCommitItem[]>(initialCommits);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCommits = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCommits();
      setCommits(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <CommitsContext.Provider value={{ commits, isLoading, fetchCommits }}>
      {children}
    </CommitsContext.Provider>
  );
}
