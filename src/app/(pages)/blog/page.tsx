import { BlogHeader } from "@/components/blog/blog-header";
import { BlogList } from "@/components/blog/blog-list";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { BlurFade } from "@/components/ui/blur-fade";
import { blogSource } from "@/lib/source";

export default function Blog() {
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

  return (
    <PageWrapper>
      <PageContent>
        <BlurFade delay={0}>
          <BlogHeader />
        </BlurFade>

        <BlurFade delay={0.1}>
          <BlogList posts={posts} />
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}
