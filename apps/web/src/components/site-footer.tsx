import { cacheLife } from "next/cache";
import { getTranslations } from "next-intl/server";
import { LocaleLink } from "@/modules/i18n/routing";

// biome-ignore lint/suspicious/useAwait: async required for "use cache"
async function getCopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tCommon = await getTranslations("common");
  const year = await getCopyrightYear();

  return (
    <footer className="colophon">
      <span className="meta">
        © {year} {tCommon("siteName")}
      </span>
      <nav aria-label={t("links")}>
        <a
          className="control"
          href="https://github.com/kWAYTV/portfolio"
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("source")}
        </a>
        <LocaleLink className="control" href="/privacy">
          {t("privacy")}
        </LocaleLink>
      </nav>
    </footer>
  );
}
