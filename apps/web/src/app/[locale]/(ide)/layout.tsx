import { IdeLayoutSkeleton } from "@/components/ide/layout/ide-layout-skeleton";
import { IdeLayoutWithCommits } from "@/components/ide/layout/ide-layout-with-commits";
import { Suspense } from "react";

interface IdeLayoutProps {
  children: React.ReactNode;
}

export default function IdeLayout({ children }: IdeLayoutProps) {
  return (
    <Suspense fallback={<IdeLayoutSkeleton>{null}</IdeLayoutSkeleton>}>
      <IdeLayoutWithCommits>{children}</IdeLayoutWithCommits>
    </Suspense>
  );
}
