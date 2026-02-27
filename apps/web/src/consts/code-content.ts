/** Placeholder source code for IDE code view. Copied from portfolio. */

export const welcomeCode = `import { Separator } from "@portfolio/ui";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { SocialNav } from "@/components/home/social-nav";
import { getGitHubRepos } from "@/lib/github";

export const metadata = {
  title: "Martin Vila",
  description: "developer · gamer · self-taught",
};

const socials = [
  { name: "github", href: "https://github.com/kWAYTV", icon: Github },
  { name: "twitter", href: "https://twitter.com/ogeperc", icon: Twitter },
  { name: "linkedin", href: "https://linkedin.com/in/mvnieto", icon: Linkedin },
  { name: "resume", href: "https://gitroll.io/profile/uezq54oxIk4V", icon: FileText },
] as const;

const featuredRepos = ["portfolio", "versend/core", "lichess-bot"];

export default async function Home() {
  const repos = await getGitHubRepos();
  const featured = repos.filter((r) => featuredRepos.includes(r.name));

  return (
    <main className="space-y-6">
      <p className="text-muted-foreground text-sm">Welcome</p>

      <header className="space-y-1.5">
        <h1 className="font-medium text-lg tracking-tight">Martin Vila</h1>
        <p className="text-muted-foreground/60 text-sm">
          developer · gamer · self-taught
        </p>
      </header>

      <p className="text-muted-foreground/80 text-sm leading-relaxed">
        Building minimal, thoughtful software. Currently exploring
        the intersection of design and engineering.
      </p>

      <Separator />
      <SocialNav links={socials} />
      <Separator />

      <section>
        <h2 className="font-medium text-sm">Featured</h2>
        <FeaturedProjects repos={featured} />
      </section>
    </main>
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

export const projectsCode = `import { Octokit } from "@octokit/rest";

interface Repository {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  pushed_at: string;
  created_at: string;
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function getRepositories(): Promise<Repository[]> {
  const { data } = await octokit.repos.listForUser({
    username: "kWAYTV",
    sort: "updated",
    per_page: 100,
  });

  return data.map(({
    name, description, language, stargazers_count,
    forks_count, html_url, pushed_at, created_at,
  }) => ({
    name, description, language, stargazers_count,
    forks_count, html_url, pushed_at, created_at,
  }));
}

export const sortOptions = ["stars", "updated", "created", "name"] as const;
export type SortOption = (typeof sortOptions)[number];

export function sortRepos(repos: Repository[], sort: SortOption) {
  return [...repos].sort((a, b) => {
    switch (sort) {
      case "stars":
        return b.stargazers_count - a.stargazers_count;
      case "updated":
        return +new Date(b.pushed_at) - +new Date(a.pushed_at);
      case "created":
        return +new Date(b.created_at) - +new Date(a.created_at);
      case "name":
        return a.name.localeCompare(b.name);
    }
  });
}

// Pinned on home page
export const featured = ["portfolio", "versend/core", "lichess-bot"];`;

export const blogCode = `import { BlogCard } from "@/components/blog/blog-card";
import { BlogHeader } from "@/components/blog/blog-header";
import { PageContent } from "@/components/shared/page-content";
import { Pagination } from "@/components/shared/pagination";
import { getBlog } from "@/lib/source";

const POSTS_PER_PAGE = 12;

export default async function BlogPage({ params, searchParams }) {
  const { locale } = await params;
  const blog = getBlog(locale);
  const allPosts = blog.getPages().sort((a, b) =>
    new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const page = Math.min(totalPages, parseInt(searchParams?.page ?? "1") || 1);
  const posts = allPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

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
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </PageContent>
  );
}`;
