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
    <header className="space-y-1.5">
      <h1 className="font-medium text-base tracking-tight sm:text-lg">
        {title}
      </h1>
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50 sm:text-xs">
        <span>{author}</span>
        <span>·</span>
        <time>{formattedDate}</time>
      </div>
    </header>
  );
}
