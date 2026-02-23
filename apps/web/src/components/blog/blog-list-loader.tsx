import { BlogList } from "@/components/blog/blog-list";
import { blogSource } from "@/lib/source";

interface Props {
  locale: string;
}

export function BlogListLoader({ locale }: Props) {
  const posts = blogSource
    .getPages(locale)
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
