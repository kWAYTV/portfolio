import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { SocialLinks } from "@/components/social-links";
import { YearTape } from "@/components/year-tape";
import { getSortedPosts } from "@/modules/blog/lib/blog";
import { HeroQuote } from "@/modules/home/components/hero-quote";
import { LocaleLink } from "@/modules/i18n/routing";
import { getPageImageUrl } from "@/modules/og/lib/og";
import { getFeaturedRepos } from "@/modules/projects/lib/featured";
import {
  getGitHubContributionCalendar,
  getGitHubRepos,
} from "@/modules/projects/lib/github";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    description: t("siteDescription"),
    openGraph: {
      images: [{ url: getPageImageUrl([locale]) }],
    },
    title: t("siteTitle"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <article className="document">
      <header>
        <h1>{t("common.siteName")}</h1>
        <p className="tagline">{t("hero.tagline")}</p>
      </header>
      <p className="lede">{t("hero.bio")}</p>
      <SocialLinks />
      <Suspense fallback={null}>
        <HomeTape emptyLabel={t("graph.empty")} locale={locale} />
      </Suspense>
      <section>
        <h2>{t("projects.featured")}</h2>
        <Suspense fallback={null}>
          <HomeWork locale={locale} />
        </Suspense>
      </section>
      <section>
        <h2>{t("blog.title")}</h2>
        <HomeNotes locale={locale} />
      </section>
      <HeroQuote />
    </article>
  );
}

async function HomeTape({
  emptyLabel,
  locale,
}: {
  emptyLabel: string;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "graph" });
  const calendar = await getGitHubContributionCalendar();
  const resolvedCaption = calendar
    ? t("caption", { count: calendar.total })
    : emptyLabel;

  return (
    <div className="year-tape">
      <YearTape
        calendar={calendar}
        caption={resolvedCaption}
        emptyLabel={emptyLabel}
      />
    </div>
  );
}

async function HomeWork({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const repos = getFeaturedRepos(await getGitHubRepos());

  if (repos.length === 0) {
    return <p className="meta">{t("noProjects")}</p>;
  }

  return (
    <>
      <ul className="hairline-list">
        {repos.map((repo) => (
          <li key={repo.id}>
            <a
              className="hairline-row"
              href={repo.html_url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="min-w-0">
                <strong>{repo.name}</strong>
                {repo.description ? <p>{repo.description}</p> : null}
              </div>
              <span>★ {repo.stargazers_count}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="meta">
        <LocaleLink href="/projects">{t("viewAll")}</LocaleLink>
      </p>
    </>
  );
}

async function HomeNotes({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getSortedPosts(locale).slice(0, 3);

  if (posts.length === 0) {
    return <p className="meta">{t("noPosts")}</p>;
  }

  return (
    <ul className="hairline-list">
      {posts.map((post) => {
        const data = post.data as {
          date?: string;
          title: string;
        };
        return (
          <li key={post.url}>
            <LocaleLink className="hairline-row" href={post.url}>
              <strong>{data.title}</strong>
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
  );
}
