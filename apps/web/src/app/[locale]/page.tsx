import { setRequestLocale } from "next-intl/server";
import { CodeView } from "@/components/ide/code-view";
import { welcomeCode } from "@/consts/code-content";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return createMetadata({
    title: "Martin Vila",
    description: "welcome to my personal space.",
  });
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CodeView code={welcomeCode} lang="tsx" />;
}
