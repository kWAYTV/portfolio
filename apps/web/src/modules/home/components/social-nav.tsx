"use client";

import { analytics } from "@repo/analytics";
import { cn } from "@/lib/utils";
import { socialLinks } from "@/modules/home/consts/social-links";

export function SocialNav() {
  return (
    <nav aria-label="Social links" className="flex flex-wrap gap-x-5 gap-y-2">
      {socialLinks.map((link) => (
        <a
          className={cn(
            "link-accent font-mono text-muted-foreground text-xs tracking-wide sm:text-sm"
          )}
          href={link.href}
          key={link.text}
          onClick={() => {
            analytics.socialClick(link.text);
            if (link.text === "resume") {
              analytics.resumeDownload();
            }
          }}
          rel="noopener noreferrer"
          target="_blank"
        >
          {link.text}
        </a>
      ))}
    </nav>
  );
}
