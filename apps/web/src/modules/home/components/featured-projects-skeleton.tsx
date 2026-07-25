import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedProjectsSkeleton() {
  return (
    <div className="band-graphite -mx-4 px-4 py-6 sm:-mx-6 sm:px-6 sm:py-7">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-3 w-16 bg-white/10" />
        <Skeleton className="h-3 w-14 bg-white/10" />
      </div>
      <ul>
        {[1, 2, 3].map((i) => (
          <li className="border-white/10 border-b py-3 last:border-b-0" key={i}>
            <Skeleton className="h-5 w-2/5 bg-white/10" />
            <Skeleton className="mt-2 h-3 w-4/5 bg-white/10" />
          </li>
        ))}
      </ul>
    </div>
  );
}
