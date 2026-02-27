import { Skeleton } from "@portfolio/ui";

interface IdeLayoutSkeletonProps {
  children: React.ReactNode;
}

/**
 * Skeleton shell matching IdeLayout structure. Shown during initial load
 * so the IDE chrome appears immediately instead of content-first.
 */
export function IdeLayoutSkeleton({ children }: IdeLayoutSkeletonProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      {/* Title bar */}
      <div className="flex h-9 shrink-0 items-center border-border border-b bg-secondary px-2 shadow-[var(--shadow-elevation-sm)] sm:px-4">
        <div className="flex shrink-0 items-center gap-2 pr-2">
          <div className="flex size-10 md:hidden" />
          <div className="hidden gap-[7px] md:flex">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="size-3 rounded-full" />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Activity bar */}
        <div className="hidden h-full w-12 shrink-0 flex-col items-center border-border border-r bg-sidebar py-1 md:flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton className="size-10 rounded-none" key={i} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="hidden w-56 shrink-0 flex-col border-border border-r bg-sidebar md:flex">
          <div className="border-border border-b px-2 py-2">
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex-1 space-y-1 p-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[75%]" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        {/* Main content */}
        <div className="flex w-full min-w-0 flex-1 flex-col overflow-hidden">
          <div className="hidden shrink-0 border-border border-b md:block">
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="shrink-0 border-border border-b px-2 py-1.5">
              <Skeleton className="h-4 w-32" />
            </div>
            <main className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="hidden h-11 shrink-0 items-center justify-between border-border border-t bg-secondary px-2 py-1 sm:h-6 sm:px-3 sm:py-0 md:flex">
        <Skeleton className="h-3 w-16" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </div>
  );
}
