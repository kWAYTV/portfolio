import { getTranslations, setRequestLocale } from "next-intl/server";
import { Pagination } from "@/components/pagination";
import { LocaleLink } from "@/modules/i18n/routing";
import { getPageImageUrl } from "@/modules/og/lib/og";
import { getGitHubRepos } from "@/modules/projects/lib/github";
import {
  type ProjectSort,
  parseProjectSort,
  queryProjects,
} from "@/modules/projects/lib/query";

const SORTS: ProjectSort[] = ["updated", "stars", "created", "name"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    description: t("subtitle"),
    openGraph: {
      images: [{ url: getPageImageUrl([locale, "projects"]) }],
    },
    title: `${t("title")} | Martin Vila`,
  };
}

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; q?: string; sort?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const query = await searchParams;
  const q = query.q ?? "";
  const sort = parseProjectSort(query.sort);
  const page = Number.parseInt(query.page ?? "1", 10) || 1;
  const t = await getTranslations();
  const result = queryProjects(await getGitHubRepos(), { page, q, sort });
  const filterQuery = new URLSearchParams();
  if (q) {
    filterQuery.set("q", q);
  }
  if (sort !== "updated") {
    filterQuery.set("sort", sort);
  }

  return (
    <article className="document">
      <header>
        <h1 className="page-title">{t("projects.title")}</h1>
        <p className="lede">{t("projects.subtitle")}</p>
      </header>
      <form className="filters">
        <input
          defaultValue={q}
          name="q"
          placeholder={t("projects.searchPlaceholder")}
          type="search"
        />
        {sort === "updated" ? null : (
          <input name="sort" type="hidden" value={sort} />
        )}
        <button type="submit">{t("projects.search")}</button>
      </form>
      <div className="project-sort">
        {SORTS.map((value) => {
          const sortParams = new URLSearchParams();
          if (q) {
            sortParams.set("q", q);
          }
          if (value !== "updated") {
            sortParams.set("sort", value);
          }
          const href =
            sortParams.size > 0 ? `/projects?${sortParams}` : "/projects";
          return (
            <LocaleLink
              aria-current={value === sort ? "page" : undefined}
              href={href}
              key={value}
            >
              {t(`projects.sort.${value}`)}
            </LocaleLink>
          );
        })}
      </div>
      <p className="meta">
        {t("projects.projectCount", { count: result.totalCount })}
        {q ? ` ${t("projects.matching", { query: q })}` : ""}
      </p>
      {result.repos.length === 0 ? (
        <p className="meta">{t("projects.noProjects")}</p>
      ) : (
        <ul className="hairline-list">
          {result.repos.map((repo) => (
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
      )}
      <Pagination
        basePath="/projects"
        currentPage={result.page}
        namespace="projects"
        query={filterQuery.toString()}
        totalPages={result.totalPages}
      />
    </article>
  );
}
