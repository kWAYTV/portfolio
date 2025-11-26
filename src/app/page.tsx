import Link from "next/link";
import { MorphingLink } from "@/components/shared/morphing-link";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";
import { BlurFade } from "@/components/ui/blur-fade";

const socialLinks = [
  { href: "https://github.com/kWAYTV", text: "github", icon: "github" },
  { href: "https://twitter.com/ogeperc", text: "twitter", icon: "twitter" },
  {
    href: "https://linkedin.com/in/mvnieto",
    text: "linkedin",
    icon: "linkedin",
  },
  {
    href: "https://gitroll.io/profile/uezq54oxIk4VFZkLigfxGmGgm57z1",
    text: "resume",
    icon: "fileText",
  },
] as const;

export default function Home() {
  return (
    <PageWrapper>
      <PageContent>
        <BlurFade delay={0}>
          <header className="space-y-1.5">
            <h1 className="font-medium text-base tracking-tight sm:text-lg">
              Martin Vila
            </h1>
            <p className="text-muted-foreground/60 text-xs sm:text-sm">
              developer · gamer · self-taught
            </p>
          </header>
        </BlurFade>

        <BlurFade delay={0.1}>
          <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
            Building minimal, thoughtful software. Currently exploring the
            intersection of design and engineering.
          </p>
        </BlurFade>

        <BlurFade delay={0.2}>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
            {socialLinks.map((link) => (
              <MorphingLink
                href={link.href}
                icon={link.icon}
                key={link.text}
                text={link.text}
              />
            ))}
          </nav>
        </BlurFade>

        <BlurFade delay={0.3}>
          <footer className="pt-2">
            <p className="font-serif text-[11px] text-muted-foreground/40 italic leading-relaxed">
              I forgot your voice, I forgot your body, I forgot your essence, I
              forgot,{" "}
              <Link
                className="transition-colors hover:text-muted-foreground/60"
                href="https://youtu.be/qEN6Vdw21rY?si=srNzXFklhDAPxGiF&t=134"
                rel="noopener noreferrer"
                target="_blank"
              >
                I&apos;m sorry
              </Link>
            </p>
          </footer>
        </BlurFade>
      </PageContent>
    </PageWrapper>
  );
}
