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
      className="group -mx-2 flex flex-col gap-2 rounded-md px-2 py-3 transition-all duration-200 hover:bg-muted/30 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
      href={url}
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        <h2 className="font-medium text-foreground/80 text-xs leading-relaxed transition-colors duration-200 group-hover:text-foreground sm:text-sm">
          {title}
        </h2>
        {description && (
          <p className="text-[11px] leading-relaxed text-muted-foreground/60 sm:text-xs">
            {description}
          </p>
        )}
      </div>
      <time className="shrink-0 whitespace-nowrap text-[10px] text-muted-foreground/50 tabular-nums transition-colors duration-200 group-hover:text-muted-foreground/70 sm:text-xs">
        {new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </time>
    </Link>
  );
}
