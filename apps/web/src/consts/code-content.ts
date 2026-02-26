export const welcomeCode = `import { Github, Twitter, Linkedin, FileText } from "lucide-react";

const name = "Martin Vila";
const tagline = "developer · gamer · self-taught";

const bio = \`Building minimal, thoughtful software. Currently exploring
the intersection of design and engineering.\`;

const socials = [
  { name: "github", href: "https://github.com/kWAYTV" },
  { name: "twitter", href: "https://twitter.com/ogeperc" },
  { name: "linkedin", href: "https://linkedin.com/in/mvnieto" },
  { name: "resume", href: "https://gitroll.io/profile/uezq54oxIk4V" },
];

const featuredRepos = ["portfolio", "versend/core", "lichess-bot"];

export default function Welcome() {
  return (
    <main>
      <p className="text-muted">Welcome</p>
      <h1>{name}</h1>
      <p>{tagline}</p>
      <p>{bio}</p>

      <nav>
        {socials.map((link) => (
          <a href={link.href} key={link.name} target="_blank">
            {link.name}
          </a>
        ))}
      </nav>

      <Separator />

      <section>
        <h2>Featured</h2>
        <FeaturedProjects repos={featuredRepos} />
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

### Freelance — 2019 - Present
Freelance Developer / Open Source Contributor

### Tokyo School — 2024 - Present
PCAP Python, Computer Programming

### Insergal — 2018 - 2019
Sales Assistant, Marketing

### Insergal — 2018 - 2019
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

  return data.map((repo) => ({
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    html_url: repo.html_url,
    pushed_at: repo.pushed_at,
  }));
}

// Featured projects pinned on home page
export const featured = [
  "portfolio",
  "versend/core",
  "lichess-bot",
];`;

export const blogCode = `---
title: Blog
description: Quiet notes from current work
---

# Blog

Quiet notes from current work. More entries will fall in here
as they are published — kept chronologically, nothing fancy.

## Latest Posts

### Shipping the Wrong Thing
*February 23, 2026*

Sometimes the right move is to ship the feature nobody asked
for and see what happens.

---

### The Side Project Graveyard
*December 22, 2025*

A guided tour through my unfinished projects and the lies
I told myself.

---

### Hello World
*November 29, 2025*

Obligatory first post where I promise to write more.`;
