"use client";

import { useTranslations } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo } from "react";
import { BlogCard } from "@/components/blog/blog-card";
import { Pagination } from "@/components/shared/pagination";

const POSTS_PER_PAGE = 3;

interface Post {
  date?: string;
  description?: string;
  title: string;
  url: string;
}

interface BlogListProps {
  locale: string;
  posts: Post[];
}

export function BlogList({ locale, posts }: BlogListProps) {
  const t = useTranslations("blog");
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
        {t("noPosts")}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground/60">
        {t("postCount", { count: posts.length })}
      </p>

      <div className="h-[16rem] space-y-1">
        {paginatedPosts.map((post) => (
          <BlogCard
            date={post.date}
            description={post.description}
            key={post.url}
            locale={locale}
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
