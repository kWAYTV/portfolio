import { getTranslations } from "next-intl/server";

interface AboutHeaderProps {
  locale: string;
}

export async function AboutHeader({ locale }: AboutHeaderProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <header className="space-y-1.5">
      <h1 className="font-medium text-base tracking-tight sm:text-lg">
        {t("title")}
      </h1>
      <p className="text-muted-foreground/60 text-xs sm:text-sm">
        {t("subtitle")}
      </p>
    </header>
  );
}
