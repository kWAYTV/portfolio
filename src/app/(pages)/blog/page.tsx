import { BlogList } from "@/components/blog/blog-list";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { BlurFade } from "@/components/ui/blur-fade";
import { blogSource } from "@/lib/source";
import { cn } from "@/lib/utils";

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

  const publishedCount = posts.length;
  const latestPublished = posts[0]?.date
    ? new Date(posts[0].date)
    : undefined;

  const stats = [
    {
      label: "Entries",
      value: publishedCount.toString().padStart(2, "0"),
      hint: publishedCount === 1 ? "first drop logged" : "published so far",
    },
    {
      label: "Latest",
      value: latestPublished
        ? latestPublished.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "Soon",
      hint: latestPublished ? "fresh ink" : "drafting",
    },
    {
      label: "Cadence",
      value: publishedCount > 0 ? "Shipping" : "Priming",
      hint: publishedCount > 0 ? "writing in the open" : "warming up",
    },
  ];

  const focusAreas = [
    "Build notes",
    "Systems thinking",
    "In-flight experiments",
  ];

  return (
    <PageWrapper>
      <PageContent className="max-w-2xl space-y-6 sm:space-y-8">
        <BlurFade delay={0}>
          <header className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground/70">
              Writing log
            </p>
            <div className="space-y-1.5">
              <h1 className="font-medium text-lg tracking-tight text-foreground sm:text-xl">
                Essays, notes, and shipping logs
              </h1>
              <p className="text-muted-foreground/70 text-sm leading-relaxed">
                Short reads on what I am building, learning, and refining. The
                stack may evolve; the intent stays minimal and honest.
              </p>
            </div>
          </header>
        </BlurFade>

        <BlurFade delay={0.05}>
          <section className="rounded-2xl border border-border/70 bg-muted/10 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <article
                  className="rounded-lg border border-border/40 bg-background/50 p-3"
                  key={stat.label}
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70">
                    {stat.hint}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-border/60 bg-background/60 p-3 sm:p-4">
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground/70">
                Current focus
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {focusAreas.map((area) => (
                  <span
                    className={cn(
                      "rounded-full border border-border/50 px-3 py-1 text-[11px] text-muted-foreground/80",
                      "uppercase tracking-[0.2em]"
                    )}
                    key={area}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </BlurFade>

        <BlurFade delay={0.1}>
          <BlogList posts={posts} />
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}
