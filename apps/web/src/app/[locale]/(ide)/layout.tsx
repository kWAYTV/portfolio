import { IdeLayoutSkeleton } from "@/components/ide/layout/ide-layout-skeleton";
import { IdeLayoutWithCommits } from "@/components/ide/layout/ide-layout-with-commits";
import { Suspense } from "react";

interface IdeLayoutProps {
  children: React.ReactNode;
}

/**
 * Single Suspense boundary: IdeLayout (client) uses usePathname/useRouter which
 * access request context. Page loaders (getGitHubRepos, blogSource) use use cache
 * or sync - no additional Suspense needed.
 */
export default function IdeLayout({ children }: IdeLayoutProps) {
  return (
    <Suspense fallback={<IdeLayoutSkeleton>{null}</IdeLayoutSkeleton>}>
      <IdeLayoutWithCommits>{children}</IdeLayoutWithCommits>
    </Suspense>
  );
}
