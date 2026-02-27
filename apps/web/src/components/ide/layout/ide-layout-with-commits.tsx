import { getRepoCommits } from "@/lib/data";
import { CommitsProvider } from "@/components/ide/commits-provider";
import { IdeLayout } from "@/components/ide/layout/ide-layout";

interface IdeLayoutWithCommitsProps {
  children: React.ReactNode;
}

export async function IdeLayoutWithCommits({
  children,
}: IdeLayoutWithCommitsProps) {
  const commits = await getRepoCommits();

  return (
    <CommitsProvider initialCommits={commits}>
      <IdeLayout>{children}</IdeLayout>
    </CommitsProvider>
  );
}
