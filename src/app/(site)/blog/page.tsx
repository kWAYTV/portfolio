import { BlogPosts } from "@/components/core/blog/posts";

export default function BlogPage() {
  return (
    <section>
      <h1 className="mb-8 font-semibold text-2xl tracking-tighter">My Blog</h1>
      <BlogPosts />
    </section>
  );
}
