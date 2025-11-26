import Link from "next/link";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { BlurFade } from "@/components/ui/blur-fade";
import { Separator } from "@/components/ui/separator";

export default function NotFound() {
  return (
    <PageWrapper>
      <PageContent>
        <BlurFade delay={0}>
          <div className="space-y-1">
            <h1 className="font-medium text-base tracking-tight sm:text-lg">
              404
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Page not found
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.1}>
          <Separator />
        </BlurFade>

        <BlurFade delay={0.2}>
          <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </BlurFade>

        <BlurFade delay={0.3}>
          <div className="flex items-center gap-3 text-muted-foreground text-xs sm:gap-4 sm:text-sm">
            <Link className="transition-colors hover:text-foreground" href="/">
              Home
            </Link>
          </div>
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}
