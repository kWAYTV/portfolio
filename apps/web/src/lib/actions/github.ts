"use server";

import { revalidateTag } from "next/cache";
import { getGitHubCommits } from "@/lib/github";

export async function getCommitsAction() {
  return await getGitHubCommits();
}

/** Invalidates the cached commit history so the next fetch gets fresh data */
// biome-ignore lint/suspicious/useAwait: Server Actions must be async
export async function revalidateCommitsAction() {
  revalidateTag("github-commits", "max");
}
