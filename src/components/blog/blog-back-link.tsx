import Link from "next/link";

export function BlogBackLink() {
  return (
    <Link
      className="text-[10px] text-muted-foreground/50 transition-colors hover:text-muted-foreground sm:text-xs"
      href="/blog"
    >
      ← Back to blog
    </Link>
  );
}
