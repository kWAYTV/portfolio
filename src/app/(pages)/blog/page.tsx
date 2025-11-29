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
      <PageContent>
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

        <BlurFade delay={0.1}>
          {posts.length === 0 ? (
            <p className="text-muted-foreground/60 text-xs sm:text-sm">
              No posts yet.
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  className="group -mx-2 block rounded-md px-2 py-2.5 transition-all duration-200 hover:bg-muted/30"
                  href={post.url}
                  key={post.url}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-medium text-foreground/80 text-xs transition-colors duration-200 group-hover:text-foreground sm:text-sm">
                      {post.data.title}
                    </h2>
                    <time className="shrink-0 text-[10px] text-muted-foreground/50 tabular-nums sm:text-xs">
                      {new Date(post.data.date ?? "").toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </time>
                  </div>
                  {post.data.description && (
                    <p className="mt-1 text-[11px] text-muted-foreground/60 sm:text-xs">
                      {post.data.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}
