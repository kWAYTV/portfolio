import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { WipPage } from "@/components/shared/wip-page";
import { BlurFade } from "@/components/ui/blur-fade";

export default function Blog() {
  return (
    <PageWrapper>
      <PageContent>
        <BlurFade delay={0}>
          <WipPage />
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}
