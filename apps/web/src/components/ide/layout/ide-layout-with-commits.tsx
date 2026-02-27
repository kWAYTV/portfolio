import { CommitsProvider } from "@/components/ide/commits-provider";
import { IdeLayout } from "@/components/ide/layout/ide-layout";

interface IdeLayoutWithCommitsProps {
  children: React.ReactNode;
}

export function IdeLayoutWithCommits({ children }: IdeLayoutWithCommitsProps) {
  return (
    <CommitsProvider>
      <IdeLayout>{children}</IdeLayout>
    </CommitsProvider>
  );
}
