import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Pagination } from "@/components/pagination";
import { getPaginatedPosts } from "@/modules/blog/lib/blog";
import { LocaleLink } from "@/modules/i18n/routing";
import { getPageImageUrl } from "@/modules/og/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    openGraph: {
      images: [{ url: getPageImageUrl([locale, "blog"]) }],
    },
    title: `${t("title")} | Martin Vila`,
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BlogIndex locale={locale} page={1} />;
}

export async function BlogIndex({
  locale,
  page,
}: {
  locale: string;
  page: number;
}) {
  const { posts, totalPages, totalCount } = getPaginatedPosts(locale, page);
  const t = await getTranslations({ locale, namespace: "blog" });
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="document">
      <header>
        <h1 className="page-title">{t("title")}</h1>
        <p className="lede">{t("subtitle")}</p>
      </header>
      <section className="section">
        <p className="meta">{t("postCount", { count: totalCount })}</p>
        {posts.length === 0 ? (
          <p className="meta">{t("noPosts")}</p>
        ) : (
          <div className="rows">
            {posts.map((post) => {
              const data = post.data as {
                date?: string;
                description?: string;
                title: string;
              };
              return (
                <LocaleLink className="row" href={post.url} key={post.url}>
                  <span className="row-title">{data.title}</span>
                  <span className="row-meta">
                    {data.date
                      ? formatter.format(new Date(data.date))
                      : t("soon")}
                  </span>
                  {data.description ? (
                    <span className="row-sub">{data.description}</span>
                  ) : null}
                </LocaleLink>
              );
            })}
          </div>
        )}
        <Pagination currentPage={page} totalPages={totalPages} />
      </section>
    </article>
  );
}
