"use client";

import { FileText, Github, Linkedin, Twitter } from "lucide-react";
import { socialLinks } from "@/consts/social-links";
import { analytics } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const icons = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  fileText: FileText,
} as const;

export function SocialNav() {
  return (
    <nav className="flex flex-wrap items-center gap-3 sm:gap-4">
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
            onClick={() => analytics.socialClick(link.text)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon className="size-3.5 transition-transform duration-200 group-hover:scale-110 sm:size-4" />
            <span className="text-xs sm:text-sm">{link.text}</span>
          </a>
        );
      })}
    </nav>
  );
}
