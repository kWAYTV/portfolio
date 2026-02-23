import { locales } from "@portfolio/i18n/config";
import { BlogList } from "@/components/blog/blog-list";
import { blogSource } from "@/lib/source";

/** Strip locale prefix from fumadocs url so next-intl Link doesn't double it. */
function stripLocalePrefix(url: string): string {
  const prefix = locales.find((loc) => url.startsWith(`/${loc}/`));
  return prefix ? url.slice(prefix.length + 2) : url;
}

interface Props {
  locale: string;
}

export function BlogListLoader({ locale }: Props) {
  const posts = blogSource
    .getPages(locale)
    .sort((a, b) => {
      const dateA = new Date(a.data.date ?? 0).getTime();
      const dateB = new Date(b.data.date ?? 0).getTime();
      return dateB - dateA;
    })
    .map((post) => ({
      url: stripLocalePrefix(post.url),
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
    }));

  return <BlogList locale={locale} posts={posts} />;
}
