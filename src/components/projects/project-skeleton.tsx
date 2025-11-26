import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-lg border border-border/50 bg-card/30 p-3 sm:p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-28 sm:h-5 sm:w-36" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-8 w-full" />
        <div className="flex items-center gap-1.5 pt-1">
          <Skeleton className="size-2 rounded-full" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProjectListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <Skeleton className="h-8 flex-1 sm:h-9" />
        <Skeleton className="h-8 w-full sm:h-9 sm:w-36" />
      </div>

      <Skeleton className="h-4 w-24" />

      <div className="grid gap-2 sm:gap-3">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </div>
  );
}
