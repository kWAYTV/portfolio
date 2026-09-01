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
    <footer className="site-footer">
      <p className="footer-close">{t("close")}</p>
      <p className="footer-meta">
        <span>{year}</span>
        <LocaleLink href="/privacy">{t("privacy")}</LocaleLink>
      </p>
    </footer>
  );
}
