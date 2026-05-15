/** Placeholder source code for IDE code view. Matches home page structure. */

export const welcomeCode = `import { Separator } from "@/components/ui/separator";
import { FeaturedProjectsLoader } from "@/modules/home/components/featured-projects-loader";
import { FeaturedProjectsSkeleton } from "@/modules/home/components/featured-projects-skeleton";
import { HeroBio } from "@/modules/home/components/hero-bio";
import { HeroHeader } from "@/modules/home/components/hero-header";
import { HeroQuote } from "@/modules/home/components/hero-quote";
import { SocialNav } from "@/modules/home/components/social-nav";
import { PageContent } from "@/components/shared/page-content";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata() {
  const t = await getTranslations("common");
  return { title: t("siteTitle"), description: t("siteDescription") };
}

export default async function Home() {
  return (
    <PageContent>
      <HeroHeader />
      <HeroBio />
      <Separator className="bg-border/50" />
      <SocialNav />
      <Separator className="bg-border/50" />
      <Suspense fallback={<FeaturedProjectsSkeleton />}>
        <FeaturedProjectsLoader />
      </Suspense>
      <HeroQuote />
    </PageContent>
  );
}`;

export const aboutCode = `# About

> A bit about me

I'm a software engineer with a passion for building backend
& web applications. Currently actively seeking new opportunities.

---

## Experience

### Freelance — *2019 - Present*
Freelance Developer / Open Source Contributor

### Tokyo School — *2024 - Present*
PCAP Python, Computer Programming

### Insergal — *2018 - 2019*
Sales Assistant, Marketing

### Insergal — *2018 - 2019*
Automotive Mechanic`;

export const projectsCode = `import "server-only";

import { Octokit } from "@octokit/rest";
import { getGitHubRepos as getRepos } from "@repo/github";
import { env } from "@repo/env/web";
import { cacheLife, cacheTag } from "next/cache";

export async function getGitHubRepos() {
  "use cache";
  cacheLife("hours");
  cacheTag("github-repos");

  const token = env.GITHUB_TOKEN;
  if (!token) return [];

  const octokit = new Octokit({ auth: token });
  return getRepos({
    octokit,
    username: "kWAYTV",
    extraRepos: [{ owner: "versend", repo: "core" }],
  });
}`;

export const blogCode = `import { BlogCard } from "@/modules/blog/components/blog-card";
import { BlogHeader } from "@/modules/blog/components/blog-header";
import { PageContent } from "@/components/shared/page-content";
import { Pagination } from "@/components/shared/pagination";
import { getBlog } from "@/modules/blog/lib/source";

const POSTS_PER_PAGE = 12;

export default async function BlogPage({ params }) {
  const { locale } = await params;
  const blog = getBlog(locale);
  const allPosts = blog.getPages().sort((a, b) =>
    new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const posts = allPosts.slice(0, POSTS_PER_PAGE);

  return (
    <PageContent>
      <BlogHeader />
      <div className="space-y-3">
        <p className="text-[11px] text-muted-foreground/60">
          {allPosts.length} post{allPosts.length !== 1 ? "s" : ""}
        </p>
        <div className="space-y-1">
          {posts.map((post) => (
            <BlogCard
              key={post.url}
              locale={locale}
              title={post.data.title}
              description={post.data.description}
              date={post.data.date}
              url={post.url}
            />
          ))}
        </div>
        <Pagination currentPage={1} totalPages={totalPages} />
      </div>
    </PageContent>
  );
}`;
