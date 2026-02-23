"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 antialiased">
        <main className="max-w-md space-y-4 text-center">
          <h1 className="font-medium text-lg">Something went wrong</h1>
          <p className="text-muted-foreground text-sm">
            An unexpected error occurred. Please try again.
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="rounded-md border border-input bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-accent"
              onClick={reset}
              type="button"
            >
              Try again
            </button>
            <a
              className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              href="/"
            >
              Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
