import { type PinnedRepo, summarizeContributions } from "@repo/github";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContributionRecorder } from "@/components/contribution-recorder";
import { Count } from "@/components/count";
import { Reveal, Rule, Stage, Wipe } from "@/components/motion";
import { SocialLinks } from "@/components/social-links";
import { getSortedPosts } from "@/modules/blog/lib/blog";
import { LocaleLink } from "@/modules/i18n/routing";
import { getPageImageUrl } from "@/modules/og/lib/og";
import { getFeaturedRepos } from "@/modules/projects/lib/featured";
import {
  getGitHubContributionCalendar,
  getGitHubPinnedRepos,
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
    <Stage className="document">
      <header className="hero">
        <Wipe>
          <h1 className="hero-name">{t("headline")}</h1>
        </Wipe>
        <Reveal>
          <p className="lede">{t("bio")}</p>
        </Reveal>
        <Reveal>
          <SocialLinks />
        </Reveal>
      </header>
      <Reveal>
        <Activity locale={locale} />
      </Reveal>
      <Reveal>
        <FeaturedWork locale={locale} />
      </Reveal>
      <Reveal>
        <LatestNotes locale={locale} />
      </Reveal>
    </Stage>
  );
}

async function Activity({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "graph" });
  const calendar = await getGitHubContributionCalendar();

  if (!calendar || calendar.days.length === 0) {
    return null;
  }

  const stats = summarizeContributions(calendar.days);
  const busiestDate = stats.busiest
    ? new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }).format(new Date(`${stats.busiest.date}T00:00:00Z`))
    : null;

  return (
    <section className="section">
      <div className="section-head">
        <Rule />
        <h2>{t("title")}</h2>
        <span className="label">
          {t("stage", { days: calendar.days.length })}
        </span>
      </div>
      <ContributionRecorder
        days={calendar.days}
        locale={locale}
        max={stats.max}
      />
      <dl className="readouts">
        <div className="readout">
          <dt className="label">{t("total")}</dt>
          <dd>
            <Count locale={locale} value={calendar.total} />
          </dd>
        </div>
        <div className="readout">
          <dt className="label">{t("activeDays")}</dt>
          <dd>
            <Count locale={locale} value={stats.activeDays} />
            <small> / {calendar.days.length}</small>
          </dd>
        </div>
        <div className="readout">
          <dt className="label">{t("longestStreak")}</dt>
          <dd>
            <Count locale={locale} value={stats.longestStreak} />
            <small> {t("days", { count: stats.longestStreak })}</small>
          </dd>
        </div>
        <div className="readout">
          <dt className="label">{t("currentStreak")}</dt>
          <dd>
            <Count locale={locale} value={stats.currentStreak} />
            <small> {t("days", { count: stats.currentStreak })}</small>
          </dd>
        </div>
        <div className="readout">
          <dt className="label">{t("busiestDay")}</dt>
          <dd>
            <Count locale={locale} value={stats.busiest?.count ?? 0} />
            <small> {busiestDate}</small>
          </dd>
        </div>
      </dl>
    </section>
  );
}

async function FeaturedWork({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const pinned = await getGitHubPinnedRepos();
  const repos: PinnedRepo[] =
    pinned.length > 0
      ? pinned
      : getFeaturedRepos(await getGitHubRepos()).map((repo) => ({
          description: repo.description,
          fullName: repo.full_name,
          language: repo.language,
          name: repo.name,
          stars: repo.stargazers_count,
          url: repo.html_url,
        }));

  return (
    <section className="section">
      <div className="section-head">
        <Rule />
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
              href={repo.url}
              key={repo.fullName}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="row-title">{repo.name}</span>
              <span className="row-meta">
                {repo.language ? `${repo.language} · ` : ""}★ {repo.stars}
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
        <Rule />
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
