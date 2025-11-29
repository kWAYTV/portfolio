import Link from "next/link";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { BlurFade } from "@/components/ui/blur-fade";
import { blogSource } from "@/lib/source";

export default function Blog() {
  const posts = blogSource.getPages().sort((a, b) => {
    const dateA = new Date(a.data.date ?? 0).getTime();
    const dateB = new Date(b.data.date ?? 0).getTime();
    return dateB - dateA;
  });

  return (
    <PageWrapper>
      <PageContent className="max-w-xl sm:max-w-2xl">
        <BlurFade delay={0}>
          <header className="space-y-1.5">
            <h1 className="font-medium text-base tracking-tight sm:text-lg">
              Blog
            </h1>
            <p className="text-muted-foreground/60 text-xs sm:text-sm">
              Thoughts and writings
            </p>
          </header>
        </BlurFade>

        {posts.length === 0 ? (
          <BlurFade delay={0.1}>
            <p className="text-muted-foreground/60 text-xs sm:text-sm">
              No posts yet.
            </p>
          </BlurFade>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {posts.map((post, i) => (
              <BlurFade delay={0.1 + i * 0.05} key={post.url}>
                <Link
                  className="group block rounded-md border border-transparent p-3 transition-all duration-200 hover:border-border/50 hover:bg-muted/20"
                  href={post.url}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-medium text-foreground/80 text-xs leading-snug transition-colors duration-200 group-hover:text-foreground sm:text-sm">
                      {post.data.title}
                    </h2>
                    <time className="shrink-0 text-[9px] text-muted-foreground/40 tabular-nums sm:text-[10px]">
                      {new Date(post.data.date ?? "").toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </time>
                  </div>
                  {post.data.description && (
                    <p className="mt-1 line-clamp-1 text-[10px] text-muted-foreground/50 sm:text-[11px]">
                      {post.data.description}
                    </p>
                  )}
                </Link>
              </BlurFade>
            ))}
          </div>
        )}
      </PageContent>
    </PageWrapper>
  );
}
