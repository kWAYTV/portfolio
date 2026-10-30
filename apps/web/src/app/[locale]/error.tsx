"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { LocaleLink } from "@/modules/i18n/navigation";
import { PageTransition } from "@/modules/motion/page-transition";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageTransition>
      <article className="document">
        <header className="page-head">
          <h1 className="page-title">{t("title")}</h1>
          <p className="lede">{t("description")}</p>
        </header>
        <p className="segment">
          <button className="control" onClick={reset} type="button">
            {t("retry")}
          </button>
          <LocaleLink className="control" href="/">
            {t("home")}
          </LocaleLink>
        </p>
      </article>
    </PageTransition>
  );
}
