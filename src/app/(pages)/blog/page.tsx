import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { WipPage } from "@/components/shared/wip-page";

export default function Blog() {
  return (
    <PageWrapper>
      <PageContent>
        <WipPage />
      </PageContent>
    </PageWrapper>
  );
}
