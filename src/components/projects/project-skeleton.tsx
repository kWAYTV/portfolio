import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <Skeleton className="size-2.5 rounded-full" />
        <Skeleton className="h-4 w-28 sm:w-36" />
      </div>
      <Skeleton className="h-3.5 w-10" />
    </div>
  );
}

export function ProjectListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-24 sm:w-28" />
      </div>

      <Skeleton className="h-4 w-20" />

      <div className="divide-y divide-border/40">
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
