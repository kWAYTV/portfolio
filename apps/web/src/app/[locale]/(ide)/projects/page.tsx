import { getTranslations, setRequestLocale } from "next-intl/server";
import { CodeView } from "@/components/ide/editor/code-view";
import { EditorContent } from "@/components/ide/editor/editor-content";
import { ProjectList } from "@/components/content/projects/project-list";
import { ProjectsHeader } from "@/components/content/projects/projects-header";
import { PageContent } from "@/components/shared/page-content";
import { projectsCode } from "@/consts/code-content";
import { getGitHubRepos } from "@/lib/data";
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

  const repos = await getGitHubRepos();

  return (
    <EditorContent
      preview={
        <PageContent>
          <ProjectsHeader />
          <ProjectList repos={repos} />
        </PageContent>
      }
      source={<CodeView code={projectsCode} lang="typescript" />}
    />
  );
}
