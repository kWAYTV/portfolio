import { Separator } from "@portfolio/ui";
import { setRequestLocale } from "next-intl/server";
import { FeaturedProjects } from "@/components/content/home/featured-projects";
import { HeroBio } from "@/components/content/home/hero-bio";
import { HeroHeader } from "@/components/content/home/hero-header";
import { HeroQuote } from "@/components/content/home/hero-quote";
import { SocialNav } from "@/components/content/home/social-nav";
import { CodeView } from "@/components/ide/editor/code-view";
import { EditorContent } from "@/components/ide/editor/editor-content";
import { PageContent } from "@/components/shared/page-content";
import { welcomeCode } from "@/consts/code-content";
import { getFeaturedRepos, getGitHubRepos } from "@/lib/data";
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

  const repos = await getGitHubRepos();
  const featured = getFeaturedRepos(repos);

  return (
    <EditorContent
      preview={
        <PageContent>
          <HeroHeader />
          <HeroBio />
          <Separator className="bg-border/50" />
          <SocialNav />
          <Separator className="bg-border/50" />
          <FeaturedProjects repos={featured} />
          <HeroQuote />
        </PageContent>
      }
      source={<CodeView code={welcomeCode} lang="tsx" />}
    />
  );
}
