import { getPageImageUrl } from "@/lib/og";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { CodeView } from "@/components/ide/editor/code-view";
import { EditorContent } from "@/components/ide/editor/editor-content";
import { ProjectListLoader } from "@/components/projects/project-list-loader";
import { ProjectListSkeleton } from "@/components/projects/project-list-skeleton";
import { ProjectsHeader } from "@/components/projects/projects-header";
import { PageContent } from "@/components/shared/page-content";
import { projectsCode } from "@/consts/code-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: `${t("title")} | Martin Vila`,
    description: t("subtitle"),
    openGraph: {
      images: [{ url: getPageImageUrl([locale, "projects"]) }],
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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
