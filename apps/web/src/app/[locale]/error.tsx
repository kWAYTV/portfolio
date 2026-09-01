"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { LocaleLink } from "@/modules/i18n/routing";

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
    <article className="document">
      <h1 className="page-title">{t("title")}</h1>
      <p className="lede">{t("description")}</p>
      <p className="meta">
        <button className="control-btn" onClick={reset} type="button">
          {t("retry")}
        </button>
        <LocaleLink href="/">{t("home")}</LocaleLink>
      </p>
    </article>
  );
}
