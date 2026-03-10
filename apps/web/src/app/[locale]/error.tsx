"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { LocaleLink } from "@/modules/i18n/routing";

export default function ErrorBoundary({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(_error);
  }, [_error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <h1 className="font-medium text-foreground text-lg">{t("title")}</h1>
      <p className="text-center text-muted-foreground/80 text-sm">
        {t("description")}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="default">
          {t("retry")}
        </Button>
        <LocaleLink className={buttonVariants({ variant: "outline" })} href="/">
          {t("home")}
        </LocaleLink>
      </div>
    </div>
  );
}
