import Link from "next/link";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";

const socialLinks = [
  { href: "https://github.com/kWAYTV", label: "github" },
  { href: "https://twitter.com/ogeperc", label: "twitter" },
  { href: "https://linkedin.com/in/mvnieto", label: "linkedin" },
  {
    href: "https://gitroll.io/profile/uezq54oxIk4VFZkLigfxGmGgm57z1",
    label: "resume",
  },
];

export default function Home() {
  return (
    <PageWrapper>
      <PageContent>
        <header className="space-y-1.5">
          <h1 className="font-medium text-base tracking-tight sm:text-lg">
            Martin Vila
          </h1>
          <p className="text-muted-foreground/60 text-xs sm:text-sm">
            developer · gamer · self-taught
          </p>
        </header>

        <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
          Building minimal, thoughtful software. Currently exploring the
          intersection of design and engineering.
        </p>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
          {socialLinks.map((link) => (
            <Link
              className="group relative text-muted-foreground/70 transition-colors duration-200 hover:text-foreground"
              href={link.href}
              key={link.label}
              rel="noopener noreferrer"
              target="_blank"
            >
              {link.label}
              <span className="-bottom-px absolute inset-x-0 h-px origin-left scale-x-0 bg-foreground/30 transition-transform duration-200 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <footer className="pt-2">
          <p className="font-serif text-[11px] text-muted-foreground/40 italic leading-relaxed">
            I forgot your voice, I forgot your body, I forgot your essence, I
            forgot, I&apos;m sorry
          </p>
        </footer>
      </PageContent>
    </PageWrapper>
  );
}
