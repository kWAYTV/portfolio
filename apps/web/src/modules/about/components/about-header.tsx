import { getTranslations } from "next-intl/server";

export async function AboutHeader() {
  const t = await getTranslations("about");

  return (
    <header className="space-y-2">
      <h1 className="font-display font-semibold text-2xl tracking-tight sm:text-3xl">
        {t("title")}
      </h1>
      <p className="max-w-[58ch] text-muted-foreground text-sm">
        {t("subtitle")}
      </p>
    </header>
  );
}
