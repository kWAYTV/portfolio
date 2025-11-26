import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-1">
          <h1 className="font-medium text-lg tracking-tight">Martin</h1>
          <p className="text-muted-foreground text-sm">
            Developer · Gamer · Designer
          </p>
        </div>

        <Separator />

        <p className="text-muted-foreground/80 text-sm leading-relaxed">
          Building minimal, thoughtful software. Currently exploring the
          intersection of design and engineering.
        </p>

        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <Link
            className="transition-colors hover:text-foreground"
            href="https://github.com/kWAYTV"
            target="_blank"
          >
            GitHub
          </Link>
          <Link
            className="transition-colors hover:text-foreground"
            href="https://twitter.com/ogeperc"
            target="_blank"
          >
            Twitter
          </Link>
        </div>
      </div>
    </main>
  );
}
