"use server";

import { getRepoCommits } from "@/lib/github";

export function getCommits() {
  return getRepoCommits();
}
