import { getTranslations } from "next-intl/server";
import { LocaleLink } from "@/modules/i18n/routing";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

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
