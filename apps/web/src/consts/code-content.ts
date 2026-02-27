export const welcomeCode = `import { Separator } from "@portfolio/ui";
import { FeaturedProjects } from "@/components/content/home/featured-projects";
import { SocialNav } from "@/components/content/home/social-nav";
import { getFeaturedRepos, getGitHubRepos } from "@/lib/data";

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
  const featured = getFeaturedRepos(repos);

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

export const blogCode = `---
title: Blog
description: Quiet notes from current work
---

import { BlogList } from "@/components/content/blog/blog-list"
import { getPosts } from "@/lib/source"

# Blog

Quiet notes from current work. More entries will fall in here
as they are published — kept chronologically, nothing fancy.

<BlogList posts={getPosts()} />

## Latest Posts

- **Shipping the Wrong Thing** — *Feb 23, 2026*
  Sometimes the right move is to ship the feature nobody asked for

- **The Side Project Graveyard** — *Dec 22, 2025*
  A guided tour through my unfinished projects and the lies I told myself

- **Hello World** — *Nov 29, 2025*
  Obligatory first post where I promise to write more`;
