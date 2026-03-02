import { getBlog } from "@/lib/source";

export const POSTS_PER_PAGE = 12;

interface PostData {
  author: string;
  date?: string;
  description?: string;
  title: string;
}

export function getSortedPosts(locale: string) {
  const blog = getBlog(locale);
  return blog.getPages().sort((a, b) => {
    const dateA = new Date((a.data as PostData).date ?? 0).getTime();
    const dateB = new Date((b.data as PostData).date ?? 0).getTime();
    return dateB - dateA;
  });
}

export function getPaginatedPosts(locale: string, page: number) {
  const allPosts = getSortedPosts(locale);
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(start, start + POSTS_PER_PAGE);

  return {
    posts,
    totalPages,
    totalCount: allPosts.length,
  };
}
