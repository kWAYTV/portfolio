import Link from "next/link";

export function HeroQuote() {
  return (
    <footer className="pt-2">
      <p className="wrap-break-word font-serif text-[11px] text-muted-foreground/40 italic leading-relaxed">
        I forgot your voice, I forgot your body, I forgot your essence, I
        forgot,{" "}
        <Link
          className="break-keep transition-colors hover:text-muted-foreground/60"
          href="https://youtu.be/qEN6Vdw21rY?si=srNzXFklhDAPxGiF&t=134"
          rel="noopener noreferrer"
          target="_blank"
        >
          I&apos;m sorry
        </Link>
      </p>
    </footer>
  );
}
