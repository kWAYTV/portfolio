"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import { Pagination } from "@/components/shared/pagination";

const POSTS_PER_PAGE = 3;

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
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPage = Math.min(Math.max(1, page ?? 1), totalPages || 1);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = useMemo(
    () => posts.slice(startIndex, startIndex + POSTS_PER_PAGE),
    [posts, startIndex]
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (posts.length === 0) {
    return (
      <p className="text-muted-foreground/60 text-xs sm:text-sm">
        No posts yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground/60">
        {posts.length} post{posts.length !== 1 && "s"}
      </p>

      <div className="h-[16rem] space-y-1">
        {paginatedPosts.map((post) => (
          <BlogCard
            date={post.date}
            description={post.description}
            key={post.url}
            title={post.title}
            url={post.url}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
}
