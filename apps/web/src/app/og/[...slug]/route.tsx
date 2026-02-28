import { getBlog } from "@/lib/source";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { OgImage } from "@/components/og/og-image";
import {
  getPageImageSegments,
  pathToSegments,
  type PagePath,
} from "@/lib/og";

const IMAGE_FILE = "image.png";
const SIZE = { width: 1200, height: 630 };

const PAGE_COPY: Record<
  string,
  Record<string, { title: string; description?: string; subtitle?: string }>
> = {
  home: {
    en: {
      title: "Martin Vila",
      description: "welcome to my personal space.",
      subtitle: "Portfolio",
    },
    es: {
      title: "Martin Vila",
      description: "Bienvenido a mi espacio personal.",
      subtitle: "Portfolio",
    },
  },
  blog: {
    en: {
      title: "Blog",
      description: "Quiet notes from current work.",
      subtitle: "Martin Vila",
    },
    es: {
      title: "Blog",
      description: "Notas breves del trabajo actual.",
      subtitle: "Martin Vila",
    },
  },
  projects: {
    en: { title: "Projects", description: "Open source work", subtitle: "Martin Vila" },
    es: { title: "Projects", description: "Trabajo open source", subtitle: "Martin Vila" },
  },
  about: {
    en: { title: "About", description: "A bit about me", subtitle: "Martin Vila" },
    es: { title: "About", description: "Un poco sobre mí", subtitle: "Martin Vila" },
  },
};

function parsePath(slug: string[]): PagePath | null {
  if (slug[slug.length - 1] !== IMAGE_FILE) return null;
  const path = slug.slice(0, -1);
  if (path.length === 0) return null;

  const [locale, ...rest] = path;
  if (!locale || !["en", "es"].includes(locale)) return null;

  if (rest.length === 0) return { type: "home", locale };
  if (rest.length === 1 && rest[0] === "blog") return { type: "blog", locale };
  if (rest.length === 1 && rest[0] === "projects") return { type: "projects", locale };
  if (rest.length === 1 && rest[0] === "about") return { type: "about", locale };
  if (rest.length === 2 && rest[0] === "blog" && rest[1] !== "page")
    return { type: "blog-post", locale, slug: rest[1] };
  if (rest.length === 3 && rest[0] === "blog" && rest[1] === "page") {
    const num = Number.parseInt(rest[2], 10);
    if (Number.isFinite(num)) return { type: "blog-page", locale, num };
  }
  return null;
}

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const pagePath = parsePath(slug);
  if (!pagePath) notFound();

  let title: string;
  let description: string | undefined;
  let subtitle: string;

  switch (pagePath.type) {
    case "home": {
      const copy = PAGE_COPY.home[pagePath.locale] ?? PAGE_COPY.home.en;
      title = copy.title;
      description = copy.description;
      subtitle = copy.subtitle ?? "Portfolio";
      break;
    }
    case "blog":
    case "blog-page": {
      const copy = PAGE_COPY.blog[pagePath.locale] ?? PAGE_COPY.blog.en;
      title = copy.title;
      description = copy.description;
      subtitle = copy.subtitle ?? "Martin Vila";
      break;
    }
    case "blog-post": {
      const blog = getBlog(pagePath.locale);
      const page = blog.getPage([pagePath.slug]);
      if (!page) notFound();
      const data = page.data as { title: string; description?: string };
      title = data.title;
      description = data.description;
      subtitle = "Martin Vila";
      break;
    }
    case "projects": {
      const copy = PAGE_COPY.projects[pagePath.locale] ?? PAGE_COPY.projects.en;
      title = copy.title;
      description = copy.description;
      subtitle = copy.subtitle ?? "Martin Vila";
      break;
    }
    case "about": {
      const copy = PAGE_COPY.about[pagePath.locale] ?? PAGE_COPY.about.en;
      title = copy.title;
      description = copy.description;
      subtitle = copy.subtitle ?? "Martin Vila";
      break;
    }
  }

  return new ImageResponse(
    <OgImage description={description} subtitle={subtitle} title={title} />,
    SIZE
  );
}

export async function generateStaticParams() {
  const params: { slug: string[] }[] = [];
  const locales = ["en", "es"] as const;

  for (const locale of locales) {
    params.push({ slug: getPageImageSegments([locale]) });
    params.push({ slug: getPageImageSegments([locale, "blog"]) });
    params.push({ slug: getPageImageSegments([locale, "projects"]) });
    params.push({ slug: getPageImageSegments([locale, "about"]) });

    const blog = getBlog(locale);
    const blogPages = blog.getPages();
    for (const page of blogPages) {
      const p: PagePath = { type: "blog-post", locale, slug: page.slugs[0] };
      params.push({ slug: getPageImageSegments(pathToSegments(p)) });
    }

    const POSTS_PER_PAGE = 12;
    const totalPages = Math.max(1, Math.ceil(blogPages.length / POSTS_PER_PAGE));
    for (let n = 2; n <= totalPages; n++) {
      const p: PagePath = { type: "blog-page", locale, num: n };
      params.push({ slug: getPageImageSegments(pathToSegments(p)) });
    }
  }

  return params;
}
