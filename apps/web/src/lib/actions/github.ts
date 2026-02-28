"use server";

import { getGitHubCommits } from "@/lib/github";

export async function getCommitsAction() {
  return await getGitHubCommits();
}
