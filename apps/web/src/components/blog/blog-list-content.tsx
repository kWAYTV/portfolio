import { BlogCard } from "@/components/blog/blog-card";
import { Pagination } from "@/components/shared/pagination";

interface BlogPost {
  data: unknown;
  url: string;
}

interface PostData {
  author: string;
  date: string;
  description?: string;
  title: string;
}

interface BlogListContentProps {
  currentPage: number;
  locale: string;
  postCountLabel: string;
  posts: BlogPost[];
  totalPages: number;
}

export function BlogListContent({
  posts,
  currentPage,
  totalPages,
  locale,
  postCountLabel,
}: BlogListContentProps) {
  return (
    <>
      <p className="text-[11px] text-muted-foreground/60">{postCountLabel}</p>
      <div className="space-y-1">
        {posts.map((post) => {
          const data = post.data as unknown as PostData;
          return (
            <BlogCard
              date={data.date}
              description={data.description}
              key={post.url}
              locale={locale}
              title={data.title}
              url={post.url}
            />
          );
        })}
      </div>
      <Pagination
        basePath="/blog"
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}
