import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { CodeView } from "@/components/ide/code-view";
import { EditorContent } from "@/components/ide/editor-content";
import { ProjectListLoader } from "@/components/projects/project-list-loader";
import { ProjectListSkeleton } from "@/components/projects/project-list-skeleton";
import { ProjectsHeader } from "@/components/projects/projects-header";
import { PageContent } from "@/components/shared/page-content";
import { projectsCode } from "@/consts/code-content";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return createMetadata({
    title: `${t("title")} | Martin Vila`,
    description: t("subtitle"),
  });
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Projects({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <EditorContent
      preview={
        <PageContent>
          <ProjectsHeader />
          <Suspense fallback={<ProjectListSkeleton />}>
            <ProjectListLoader />
          </Suspense>
        </PageContent>
      }
      source={<CodeView code={projectsCode} lang="typescript" />}
    />
  );
}
