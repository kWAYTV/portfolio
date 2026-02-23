interface BlogPostHeaderProps {
  author: string;
  date: string;
  title: string;
}

export function BlogPostHeader({ title, author, date }: BlogPostHeaderProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
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
