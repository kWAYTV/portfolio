"use client";

import { analytics } from "@portfolio/analytics";
import Link from "next/link";
import { Spoiler } from "spoiled";

export function HeroQuote() {
  return (
    <footer className="pt-2">
      <p className="wrap-break-word font-serif text-[11px] text-muted-foreground/60 italic leading-relaxed">
        <Spoiler revealOn="hover">
          I forgot your voice, I forgot your body, I forgot your essence, I
          forgot,{" "}
          <Link
            className="break-keep transition-colors hover:text-muted-foreground/80"
            href="https://youtu.be/qEN6Vdw21rY?si=srNzXFklhDAPxGiF&t=134"
            onClick={() =>
              analytics.externalLink("https://youtu.be/qEN6Vdw21rY")
            }
            rel="noopener noreferrer"
            target="_blank"
          >
            I&apos;m sorry
          </Link>
        </Spoiler>
      </p>
    </footer>
  );
}
