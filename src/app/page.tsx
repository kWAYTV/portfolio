import Link from "next/link";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <PageWrapper>
      <PageContent>
        <div className="space-y-1">
          <h1 className="font-medium text-base tracking-tight sm:text-lg">
            Martin Vila
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            developer · gamer · self-taught
          </p>
        </div>

        <Separator />

        <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
          Building minimal, thoughtful software. Currently exploring the
          intersection of design and engineering.
        </p>

        <div className="flex items-center gap-3 text-muted-foreground text-xs sm:gap-4 sm:text-sm">
          <Link
            className="transition-colors hover:text-foreground"
            href="https://github.com/kWAYTV"
            target="_blank"
          >
            gitHub
          </Link>

          <Link
            className="transition-colors hover:text-foreground"
            href="https://twitter.com/ogeperc"
            target="_blank"
          >
            twitter
          </Link>

          <Link
            className="transition-colors hover:text-foreground"
            href="https://gitroll.io/profile/uezq54oxIk4VFZkLigfxGmGgm57z1"
            target="_blank"
          >
            resume
          </Link>

          <Link
            className="transition-colors hover:text-foreground"
            href="https://linkedin.com/in/mvnieto"
            target="_blank"
          >
            linkedin
          </Link>
        </div>

        <Separator />

        <p className="text-muted-foreground/60 text-xs sm:text-sm">
          <span className="text-[10px] italic">
            I forgot your voice, I forgot your body, I forgot your essence, I
            forgot, I&apos;m sorry
          </span>
        </p>
      </PageContent>
    </PageWrapper>
  );
}
