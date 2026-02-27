import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("common");
  return (
    <main className="flex min-h-svh items-center justify-center">
      {t("welcome")}
    </main>
  );
}
