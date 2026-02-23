import { Skeleton } from "@/components/ui/skeleton";

export function ProjectListSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-20 sm:w-28" />
      </div>
      <Skeleton className="h-4 w-24" />
      <div className="space-y-0.5">
        {["a", "b", "c", "d", "e"].map((id) => (
          <Skeleton className="h-10 w-full" key={id} />
        ))}
      </div>
    </div>
  );
}
