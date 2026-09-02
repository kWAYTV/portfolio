import { getTranslations } from "next-intl/server";
import { LocaleLink } from "@/modules/i18n/routing";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <article className="document">
      <header className="page-head">
        <h1 className="page-title">{t("title")}</h1>
        <p className="lede">{t("description")}</p>
      </header>
      <p>
        <LocaleLink className="control" href="/">
          {t("home")}
        </LocaleLink>
      </p>
    </article>
  );
}
