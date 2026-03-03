"use client";

import { FileTextIcon } from "@/components/ui/file-text";
import { GithubIcon } from "@/components/ui/github";
import { LinkedinIcon } from "@/components/ui/linkedin";
import { TwitterIcon } from "@/components/ui/twitter";
import { socialLinks } from "@/consts/social-links";
import { cn } from "@/lib/utils";

const icons = {
  github: GithubIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  fileText: FileTextIcon,
} as const;

export function SocialNav() {
  return (
    <nav className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4 sm:gap-4">
      {socialLinks.map((link) => {
        const Icon = icons[link.icon as keyof typeof icons];
        return (
          <a
            className={cn(
              "group flex items-center gap-1.5 text-muted-foreground/70 transition-colors duration-200",
              "hover:text-foreground"
            )}
            href={link.href}
            key={link.text}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon
              className="transition-transform duration-200 group-hover:scale-110"
              size={16}
            />
            <span className="text-xs sm:text-sm">{link.text}</span>
          </a>
        );
      })}
    </nav>
  );
}
