"use client";

import { BlogCard } from "@/components/blog/blog-card";
import { BlurFade } from "@/components/ui/blur-fade";

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

  return (
    <div className="space-y-0.5">
      {posts.map((post, i) => (
        <BlurFade delay={0.1 + i * 0.05} key={post.url}>
          <BlogCard
            date={post.date ?? ""}
            description={post.description}
            title={post.title}
            url={post.url}
          />
        </BlurFade>
      ))}
    </div>
  );
}
