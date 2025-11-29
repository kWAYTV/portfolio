"use client";

import { BlogCard } from "@/components/blog/blog-card";
import { BlurFade } from "@/components/ui/blur-fade";

type Post = {
  url: string;
  data: {
    title: string;
    description?: string;
    date?: string;
  };
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
    <div className="space-y-1">
      {posts.map((post, i) => (
        <BlurFade delay={0.1 + i * 0.05} key={post.url}>
          <BlogCard
            date={post.data.date ?? ""}
            description={post.data.description}
            title={post.data.title}
            url={post.url}
          />
        </BlurFade>
      ))}
    </div>
  );
}
