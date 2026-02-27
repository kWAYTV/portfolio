"use server";

import { getRepoCommits } from "@/lib/github";

export async function getCommits() {
  return getRepoCommits();
}
