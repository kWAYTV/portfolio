import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogListLoader } from "@/components/blog/blog-list-loader";
import { BlogListSkeleton } from "@/components/blog/blog-list-skeleton";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Blog | Martin Vila",
  description:
    "Quiet notes from current work. More entries will fall in here as they are published—kept chronologically, nothing fancy.",
});

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Blog({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageWrapper>
      <PageContent>
        <BlogHeader />
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogListLoader locale={locale} />
        </Suspense>
      </PageContent>
    </PageWrapper>
  );
}
