import { BlogList } from "@/components/blog/blog-list";
import { blogSource } from "@/lib/source";

export function BlogListLoader() {
  const posts = blogSource
    .getPages()
    .sort((a, b) => {
      const dateA = new Date(a.data.date ?? 0).getTime();
      const dateB = new Date(b.data.date ?? 0).getTime();
      return dateB - dateA;
    })
    .map((post) => ({
      url: post.url,
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
    }));

  return <BlogList posts={posts} />;
}
