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

  return (
    <article className="document">
      <header>
        <h1 className="page-title">{t("title")}</h1>
        <p className="lede">{t("subtitle")}</p>
      </header>
      <p className="meta">{t("postCount", { count: totalCount })}</p>
      {posts.length === 0 ? (
        <p className="meta">{t("noPosts")}</p>
      ) : (
        <ul className="hairline-list">
          {posts.map((post) => {
            const data = post.data as {
              date?: string;
              description?: string;
              title: string;
            };
            return (
              <li key={post.url}>
                <LocaleLink className="hairline-row" href={post.url}>
                  <div className="min-w-0">
                    <strong>{data.title}</strong>
                    {data.description ? <p>{data.description}</p> : null}
                  </div>
                  <time>
                    {data.date
                      ? new Date(data.date).toLocaleDateString(locale, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : t("soon")}
                  </time>
                </LocaleLink>
              </li>
            );
          })}
        </ul>
      )}
      <Pagination currentPage={page} totalPages={totalPages} />
    </article>
  );
}
