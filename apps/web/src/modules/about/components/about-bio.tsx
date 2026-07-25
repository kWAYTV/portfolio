import { getTranslations } from "next-intl/server";

export async function AboutBio() {
  const t = await getTranslations("about");

  return (
    <p className="max-w-[58ch] text-muted-foreground text-sm leading-relaxed sm:text-[length:var(--text-md)]">
      {t("bio")}
    </p>
  );
}
