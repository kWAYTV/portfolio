import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BlogCardVariant = "featured" | "compact";

type BlogCardProps = {
  title: string;
  description?: string;
  date?: string;
  url: string;
  variant?: BlogCardVariant;
};

const fullDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function BlogCard({
  title,
  description,
  date,
  url,
  variant = "compact",
}: BlogCardProps) {
  const isFeatured = variant === "featured";
  const formattedDate = date ? fullDateFormatter.format(new Date(date)) : "Soon";

  return (
    <Link
      className={cn(
        "group relative flex rounded-xl border transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/50",
        isFeatured
          ? "flex-col gap-4 overflow-hidden border-border/70 bg-card/60 px-4 py-4 sm:px-5"
          : "flex-col gap-2 border-border/30 px-3 py-3 hover:border-border/60 hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
      )}
      href={url}
    >
      <div
        className={cn(
          "min-w-0 flex-1 text-foreground",
          isFeatured ? "space-y-2" : "space-y-1.5"
        )}
      >
        <p
          className={cn(
            "text-muted-foreground/70 uppercase tracking-[0.2em] text-[10px] tabular-nums",
            isFeatured && "text-[11px]"
          )}
        >
          {formattedDate}
        </p>
        <h2
          className={cn(
            "font-medium text-foreground/90 leading-tight transition-colors duration-200 group-hover:text-foreground",
            isFeatured ? "text-base sm:text-lg" : "text-xs sm:text-sm"
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "text-muted-foreground/70 transition-colors duration-200 group-hover:text-muted-foreground",
              isFeatured ? "text-sm sm:text-base" : "text-[11px] sm:text-xs"
            )}
          >
            {description}
          </p>
        )}
      </div>
      <div
        className={cn(
          "flex shrink-0 items-center gap-1 text-muted-foreground/70 transition-colors duration-200 group-hover:text-foreground/70",
          isFeatured ? "text-xs" : "text-[10px]"
        )}
      >
        <span>{isFeatured ? "Read entry" : "Open"}</span>
        <ArrowUpRight className={cn("transition-all duration-200", isFeatured ? "size-4" : "size-3.5")} />
      </div>
    </Link>
  );
}
