import { getTranslations } from "next-intl/server";

export async function AboutHeader() {
  const t = await getTranslations("about");

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
