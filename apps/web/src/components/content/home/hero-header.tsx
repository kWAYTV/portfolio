import { getTranslations } from "next-intl/server";

export async function HeroHeader() {
  const t = await getTranslations("hero");

  return (
    <header className="space-y-1.5">
      <h1 className="font-medium text-base tracking-tight sm:text-lg">
        Martin Vila
      </h1>
      <p className="text-muted-foreground/80 text-xs sm:text-sm">
        {t("tagline")}
      </p>
    </header>
  );
}
