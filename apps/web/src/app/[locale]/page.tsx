import { summarizeContributions } from "@repo/github";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContributionRecorder } from "@/components/contribution-recorder";
import { SocialLinks } from "@/components/social-links";
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
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <article className="document">
      <section className="stat-hero">
        <p className="lede">{t("bio")}</p>
        <SocialLinks />
        <StatHero locale={locale} />
      </section>
      <FeaturedWork locale={locale} />
      <LatestNotes locale={locale} />
      <HeroQuote />
    </article>
  );
}

async function StatHero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "graph" });
  const calendar = await getGitHubContributionCalendar();

  if (!calendar || calendar.days.length === 0) {
    return <p className="meta">{t("empty")}</p>;
  }

  const stats = summarizeContributions(calendar.days);
  const formatted = new Intl.NumberFormat(locale).format(calendar.total);
  const busiestDate = stats.busiest
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }).format(new Date(`${stats.busiest.date}T00:00:00Z`))
    : null;

  return (
    <>
      <div className="figure-block">
        <span
          aria-hidden="true"
          className="figure"
          style={{ "--target": calendar.total } as React.CSSProperties}
        />
        <span className="sr-only">{formatted}</span>
        <p className="qualifier">
          {t("qualifier", { days: calendar.days.length })}
        </p>
      </div>
      <ContributionRecorder
        days={calendar.days}
        locale={locale}
        max={stats.max}
      />
      <dl className="readouts">
        <div className="readout">
          <dt className="label">{t("activeDays")}</dt>
          <dd>
            {stats.activeDays}
            <small> / {calendar.days.length}</small>
          </dd>
        </div>
        <div className="readout">
          <dt className="label">{t("longestStreak")}</dt>
          <dd>
            {stats.longestStreak}
            <small> {t("days", { count: stats.longestStreak })}</small>
          </dd>
        </div>
        <div className="readout">
          <dt className="label">{t("currentStreak")}</dt>
          <dd>
            {stats.currentStreak}
            <small> {t("days", { count: stats.currentStreak })}</small>
          </dd>
        </div>
        <div className="readout">
          <dt className="label">{t("busiestDay")}</dt>
          <dd>
            {stats.busiest?.count ?? 0}
            <small> {busiestDate}</small>
          </dd>
        </div>
      </dl>
    </>
  );
}

async function FeaturedWork({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const repos = getFeaturedRepos(await getGitHubRepos());

  return (
    <section className="section">
      <div className="section-head">
        <h2>{t("featured")}</h2>
        <LocaleLink className="label" href="/projects">
          {t("viewAll")}
        </LocaleLink>
      </div>
      {repos.length === 0 ? (
        <p className="meta">{t("noProjects")}</p>
      ) : (
        <div className="rows">
          {repos.map((repo) => (
            <a
              className="row"
              href={repo.html_url}
              key={repo.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="row-title">{repo.name}</span>
              <span className="row-meta">
                {repo.language ? `${repo.language} · ` : ""}★{" "}
                {repo.stargazers_count}
              </span>
              {repo.description ? (
                <span className="row-sub">{repo.description}</span>
              ) : null}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

async function LatestNotes({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getSortedPosts(locale).slice(0, 3);
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <section className="section">
      <div className="section-head">
        <h2>{t("title")}</h2>
        <LocaleLink className="label" href="/blog">
          {t("viewAll")}
        </LocaleLink>
      </div>
      {posts.length === 0 ? (
        <p className="meta">{t("noPosts")}</p>
      ) : (
        <div className="rows">
          {posts.map((post) => {
            const data = post.data as { date?: string; title: string };
            return (
              <LocaleLink className="row" href={post.url} key={post.url}>
                <span className="row-title">{data.title}</span>
                <span className="row-meta">
                  {data.date
                    ? formatter.format(new Date(data.date))
                    : t("soon")}
                </span>
              </LocaleLink>
            );
          })}
        </div>
      )}
    </section>
  );
}
