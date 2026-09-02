import { getTranslations } from "next-intl/server";
import { LocaleLink } from "@/modules/i18n/routing";

export async function Pagination({
  basePath,
  currentPage,
  query,
  totalPages,
}: {
  basePath: "/projects";
  currentPage: number;
  query?: string;
  totalPages: number;
}) {
  const t = await getTranslations("projects");

  if (totalPages <= 1) {
    return null;
  }

  const prevHref =
    currentPage > 1 ? pageHref(basePath, currentPage - 1, query) : null;
  const nextHref =
    currentPage < totalPages
      ? pageHref(basePath, currentPage + 1, query)
      : null;

  return (
    <nav aria-label="Pagination" className="pager">
      {prevHref ? (
        <LocaleLink className="control" href={prevHref}>
          {t("prev")}
        </LocaleLink>
      ) : (
        <span aria-disabled="true" className="control">
          {t("prev")}
        </span>
      )}
      <span className="mono">
        {currentPage} / {totalPages}
      </span>
      {nextHref ? (
        <LocaleLink className="control" href={nextHref}>
          {t("next")}
        </LocaleLink>
      ) : (
        <span aria-disabled="true" className="control">
          {t("next")}
        </span>
      )}
    </nav>
  );
}

function pageHref(basePath: string, page: number, query?: string): string {
  const params = new URLSearchParams(query);
  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
