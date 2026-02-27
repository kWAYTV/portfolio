import { getRepoCommits } from "@/lib/github";
import { NextResponse } from "next/server";

export async function GET() {
  const commits = await getRepoCommits();
  return NextResponse.json(commits);
}
