import Link from "next/link";

type BlogCardProps = {
  title: string;
  description?: string;
  date: string;
  url: string;
};

export function BlogCard({ title, description, date, url }: BlogCardProps) {
  return (
    <Link
      className="group -mx-2 block rounded-md px-2 py-2.5 transition-all duration-200 hover:bg-muted/30"
      href={url}
    >
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h2 className="min-w-0 flex-1 font-medium text-foreground/80 text-xs transition-colors duration-200 group-hover:text-foreground sm:text-sm">
          {title}
        </h2>
        <time className="shrink-0 text-[10px] text-muted-foreground/50 tabular-nums sm:text-xs">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      </div>
      {description && (
        <p className="mt-1 text-[11px] text-muted-foreground/60 sm:text-xs">
          {description}
        </p>
      )}
    </Link>
  );
}
