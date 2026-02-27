import { IdeLayout } from "@/components/ide/layout/ide-layout";
import { getRepoCommits } from "@/lib/github";

interface IdeLayoutWithCommitsProps {
  children: React.ReactNode;
}

export async function IdeLayoutWithCommits({
  children,
}: IdeLayoutWithCommitsProps) {
  const commits = await getRepoCommits();
  return <IdeLayout commits={commits}>{children}</IdeLayout>;
}
