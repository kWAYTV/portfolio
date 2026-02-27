import { setRequestLocale } from "next-intl/server";
import { CodeView } from "@/components/ide/editor/code-view";
import { EditorContent } from "@/components/ide/editor/editor-content";
import { welcomeCode } from "@/consts/code-content";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <EditorContent
      preview={
        <main className="flex min-h-full items-center justify-center p-8">
          <p>Home</p>
        </main>
      }
      source={<CodeView code={welcomeCode} lang="tsx" />}
    />
  );
}
