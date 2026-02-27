"use client";

/**
 * Pathname-dependent IDE chrome. Isolated in Suspense so page content can be static.
 */
import { usePathname, useRouter } from "@i18n/routing";
import { useCommits } from "@/components/ide/commits-provider";
import { IdeChromeShell } from "@/components/ide/layout/ide-chrome-shell";
import { useIdeChromeEffects } from "@/hooks/use-ide-chrome-effects";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useIdeLayoutStore } from "@/stores/ide-layout-store";

export function IdeChrome() {
  const { commits, fetchCommits, isLoading: isRefreshing } = useCommits();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const layout = useIdeLayoutStore();

  useIdeChromeEffects({ pathname, router, fetchCommits });

  const handleFocusSourceControl = () => layout.focusSourceControl(isMobile);

  return (
    <IdeChromeShell
      commits={commits}
      fetchCommits={fetchCommits}
      isRefreshing={isRefreshing}
      layout="grid"
      onFocusSourceControl={handleFocusSourceControl}
      pathname={pathname}
    />
  );
}
