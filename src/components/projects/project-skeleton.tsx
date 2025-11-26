import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2">
        <Skeleton className="size-2 rounded-full" />
        <Skeleton className="h-3.5 w-24 sm:w-32" />
      </div>
      <Skeleton className="h-3 w-8" />
    </div>
  );
}

export function ProjectListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 flex-1" />
        <Skeleton className="h-7 w-28" />
      </div>

      <Skeleton className="h-3 w-16" />

      <div className="divide-y divide-border/50">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
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
