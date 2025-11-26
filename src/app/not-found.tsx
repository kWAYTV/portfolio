import Link from "next/link";
import { ThemeToggle } from "@/components/theming/toggle";
import { Separator } from "@/components/ui/separator";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh items-center justify-center px-4 sm:px-6">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm space-y-5 sm:max-w-md sm:space-y-6">
        <div className="space-y-1">
          <h1 className="font-medium text-base tracking-tight sm:text-lg">
            404
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Page not found
          </p>
        </div>

        <Separator />

        <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center gap-3 text-muted-foreground text-xs sm:gap-4 sm:text-sm">
          <Link className="transition-colors hover:text-foreground" href="/">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
