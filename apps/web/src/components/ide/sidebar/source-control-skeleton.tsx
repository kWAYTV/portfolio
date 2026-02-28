import { Skeleton } from "@/components/ui/skeleton";

export function SourceControlCommitHistorySkeleton() {
  return (
    <div className="space-y-0.5 py-1">
      {[1, 2, 3].map((i) => (
        <div className="rounded px-2 py-1.5" key={i}>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="mt-0.5 h-2.5 w-3/4" />
        </div>
      ))}
    </div>
  );
}
