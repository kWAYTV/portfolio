import { Skeleton } from "@portfolio/ui";

export default function Loading() {
  return (
    <div className="space-y-1 p-6 font-mono text-[13px]">
      {Array.from({ length: 25 }, (_, i) => (
        <Skeleton
          className="h-[20px] rounded-none"
          key={`loading-${i + 1}`}
          style={{ width: `${20 + Math.random() * 60}%` }}
        />
      ))}
    </div>
  );
}
