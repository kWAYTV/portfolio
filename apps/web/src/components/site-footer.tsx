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
  const year = await getCopyrightYear();

  return (
    <footer className="colophon">
      <p>
        {t("colophon")} · {year}
      </p>
      <nav aria-label={t("links")}>
        <a
          href="https://github.com/kWAYTV/portfolio"
          rel="noopener noreferrer"
          target="_blank"
        >
          {t("source")}
        </a>
        <LocaleLink href="/privacy">{t("privacy")}</LocaleLink>
      </nav>
    </footer>
  );
}
