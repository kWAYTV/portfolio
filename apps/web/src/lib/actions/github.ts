"use server";

import { revalidateTag } from "next/cache";
import { getGitHubCommits } from "@/lib/github";

export async function getCommitsAction() {
  return await getGitHubCommits();
}

/** Invalidates the cached commit history so the next fetch gets fresh data */
export function revalidateCommitsAction() {
  revalidateTag("github-commits");
}
