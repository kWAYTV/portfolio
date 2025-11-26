import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-xl space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="font-medium text-4xl tracking-tight sm:text-5xl">
            Martin
          </h1>
          <p className="text-muted-foreground">Developer · Gamer · Designer</p>
        </div>

        <p className="mx-auto max-w-md text-pretty text-muted-foreground/80">
          Building minimal, thoughtful software. Currently exploring the
          intersection of design and engineering.
        </p>

        <div className="flex h-5 items-center justify-center gap-4 text-sm">
          <Link href="https://github.com/kWAYTV" target="_blank">
            GitHub
          </Link>
          <Link href="https://twitter.com/ogeperc" target="_blank">
            Twitter
          </Link>
        </div>
      </div>
    </main>
  );
}
