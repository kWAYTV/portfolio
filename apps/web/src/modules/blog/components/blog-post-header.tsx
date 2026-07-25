interface BlogPostHeaderProps {
  author: string;
  date: string;
  locale: string;
  title: string;
}

export function BlogPostHeader({
  title,
  author,
  date,
  locale,
}: BlogPostHeaderProps) {
  const formattedDate = new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <header className="space-y-3 border-border border-b pb-5">
      <h1 className="font-display font-semibold text-2xl tracking-tight sm:text-3xl">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.06em] sm:text-xs">
        <span>{author}</span>
        <span aria-hidden>·</span>
        <time dateTime={date}>{formattedDate}</time>
      </div>
    </header>
  );
}
