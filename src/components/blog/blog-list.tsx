"use client";

import { BlogCard } from "@/components/blog/blog-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { Separator } from "@/components/ui/separator";

type Post = {
  url: string;
  title: string;
  description?: string;
  date?: string;
};

type BlogListProps = {
  posts: Post[];
};

export function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <p className="text-muted-foreground/60 text-xs sm:text-sm">
        No posts yet.
      </p>
    );
  }

  const [featured, ...archive] = posts;
  const reservedSlots = Math.max(0, 3 - posts.length);

  return (
    <div className="space-y-6 sm:space-y-7">
      <section className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Latest drop
        </p>
        <BlurFade delay={0.1} key={featured.url}>
          <BlogCard
            date={featured.date}
            description={featured.description}
            title={featured.title}
            url={featured.url}
            variant="featured"
          />
        </BlurFade>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-muted-foreground/60 sm:text-[11px]">
          <span>Archive queue</span>
          <span className="tracking-[0.15em] text-muted-foreground/50">
            {archive.length.toString().padStart(2, "0")}
          </span>
        </div>
        {archive.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/10 px-3 py-4 text-xs text-muted-foreground/70">
            Once more notes drop, they will fold in here chronologically.
          </div>
        ) : (
          <div className="space-y-1">
            {archive.map((post, i) => (
              <BlurFade delay={0.2 + i * 0.05} key={post.url}>
                <BlogCard
                  date={post.date}
                  description={post.description}
                  title={post.title}
                  url={post.url}
                />
              </BlurFade>
            ))}
          </div>
        )}
      </section>

      {reservedSlots > 0 && (
        <section className="space-y-2">
          <Separator className="border-border/40" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
            Incoming
          </p>
          <div className="space-y-1.5">
            {Array.from({ length: reservedSlots }).map((_, index) => (
              <div
                className="flex items-center justify-between rounded-xl border border-dashed border-border/60 bg-muted/5 px-3 py-2 text-[11px] text-muted-foreground/60"
                key={`placeholder-${index}`}
              >
                <span>Draft slot {index + 1}</span>
                <span className="text-[9px] uppercase tracking-[0.4em]">
                  Queued
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
