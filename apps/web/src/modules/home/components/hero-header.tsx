import { getTranslations } from "next-intl/server";

export async function HeroHeader() {
  const t = await getTranslations("hero");
  const tCommon = await getTranslations("common");

  return (
    <header className="space-y-3">
      <h1 className="font-display font-semibold text-[length:var(--text-display)] text-foreground tracking-tight">
        {tCommon("siteName")}
      </h1>
      <p className="font-mono-label text-muted-foreground">{t("tagline")}</p>
    </header>
  );
}
