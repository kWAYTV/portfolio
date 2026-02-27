import { getTranslations } from "next-intl/server";

export async function AboutBio() {
  const t = await getTranslations("about");

  return (
    <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
      {t("bio")}
    </p>
  );
}
