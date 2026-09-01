import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogPostViewTracker } from "@/modules/blog/components/blog-post-view-tracker";
import { getBlog } from "@/modules/blog/lib/source";
import { LocaleLink } from "@/modules/i18n/routing";
import { getPageImageUrl } from "@/modules/og/lib/og";

interface BlogPageData {
  author: string;
  body: React.ComponentType<{
    components?: Record<string, React.ComponentType>;
  }>;
  date: string;
  description?: string;
  title: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getBlog(locale).getPage([slug]);
  if (!page) {
    return {};
  }
  return {
    description: page.data.description as string,
    openGraph: {
      images: [{ url: getPageImageUrl([locale, "blog", slug]) }],
    },
    title: `${page.data.title} | Martin Vila`,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = getBlog(locale).getPage([slug]);

  if (!page) {
    notFound();
  }

  const data = page.data as unknown as BlogPageData;
  const Mdx = data.body;
  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <article className="document">
      <BlogPostViewTracker slug={slug} />
      <header>
        <LocaleLink className="label" href="/blog">
          {t("backToBlog")}
        </LocaleLink>
        <h1 className="page-title">{data.title}</h1>
        <p className="meta">
          {new Date(data.date).toLocaleDateString(locale, {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
          {data.author ? ` · ${data.author}` : ""}
        </p>
      </header>
      <div className="prose">
        <Mdx />
      </div>
    </article>
  );
}

export function generateStaticParams(): { locale: string; slug: string }[] {
  return (["en", "es"] as const).flatMap((locale) =>
    getBlog(locale)
      .getPages()
      .map((page) => ({
        locale,
        slug: page.slugs[0],
      }))
  );
}
