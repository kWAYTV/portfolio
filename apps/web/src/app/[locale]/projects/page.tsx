import { getTranslations, setRequestLocale } from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { PageContent } from "@/components/shared/page-content";
import { CodeView } from "@/modules/ide/components/editor/code-view";
import { EditorContent } from "@/modules/ide/components/editor/editor-content";
import { projectsCode } from "@/modules/ide/consts/code-content";
import { getPageImageUrl } from "@/modules/og/lib/og";
import { ProjectListLoader } from "@/modules/projects/components/project-list-loader";
import { ProjectListSkeleton } from "@/modules/projects/components/project-list-skeleton";
import { ProjectsHeader } from "@/modules/projects/components/projects-header";

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
          <NuqsAdapter>
            <Suspense fallback={<ProjectListSkeleton />}>
              <ProjectListLoader />
            </Suspense>
          </NuqsAdapter>
        </PageContent>
      }
      source={<CodeView code={projectsCode} lang="typescript" />}
    />
  );
}
