import { BlogList } from "@/components/blog/blog-list";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { BlurFade } from "@/components/ui/blur-fade";
import { blogSource } from "@/lib/source";

export default function Blog() {
  const posts = blogSource.getPages().sort((a, b) => {
    const dateA = new Date(a.data.date ?? 0).getTime();
    const dateB = new Date(b.data.date ?? 0).getTime();
    return dateB - dateA;
  });

  return (
    <PageWrapper>
      <PageContent>
        <BlurFade delay={0}>
          <header className="space-y-1.5">
            <h1 className="font-medium text-base tracking-tight sm:text-lg">
              Blog
            </h1>
            <p className="text-muted-foreground/60 text-xs sm:text-sm">
              Thoughts and writings
            </p>
          </header>
        </BlurFade>

        <BlurFade delay={0.1}>
          <BlogList posts={posts} />
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}
