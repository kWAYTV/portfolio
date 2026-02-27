"use client";

import type { GitCommitItem } from "@/lib/github";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const CommitsContext = createContext<{
  commits: GitCommitItem[];
  isLoading: boolean;
}>({ commits: [], isLoading: false });

export function useCommits() {
  return useContext(CommitsContext);
}

export function CommitsProvider({ children }: { children: React.ReactNode }) {
  const [commits, setCommits] = useState<GitCommitItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCommits = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/github/commits");
      if (res.ok) {
        const data = await res.json();
        setCommits(data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCommits();
  }, [fetchCommits]);

  return (
    <CommitsContext.Provider value={{ commits, isLoading }}>
      {children}
    </CommitsContext.Provider>
  );
}
